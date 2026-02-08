import Foundation

@MainActor
final class NvimController {
    enum ControllerError: Error, LocalizedError {
        case connectTimeout
        case invalidResponse
        case missingNvim

        var errorDescription: String? {
            switch self {
            case .connectTimeout:
                return "Timed out connecting to Neovim"
            case .invalidResponse:
                return "Invalid response from Neovim"
            case .missingNvim:
                return "Neovim (nvim) not found on PATH."
            }
        }
    }

    private let rpc = NvimRPC()
    private weak var workspace: WorkspaceState?
    private let socketPath: String
    private(set) var terminalView: GhosttyTerminalView
    private var notificationsTask: Task<Void, Never>?
    private var isRunning = false
    private var bufferByURL: [URL: Int64] = [:]
    private var urlByBuffer: [Int64: URL] = [:]

    init(workspace: WorkspaceState, ghosttyApp: GhosttyApp, workingDirectory: String, nvimPath: String) {
        self.workspace = workspace
        let socketURL = FileManager.default.temporaryDirectory
            .appendingPathComponent("smithers-nvim-\(UUID().uuidString).sock")
        socketPath = socketURL.path
        let command = "\(Self.shellEscape(nvimPath)) --listen \(Self.shellEscape(socketPath))"
        terminalView = GhosttyTerminalView(
            app: ghosttyApp,
            workingDirectory: workingDirectory,
            command: command
        )
    }

    deinit {
        notificationsTask?.cancel()
        rpc.disconnect()
        try? FileManager.default.removeItem(atPath: socketPath)
    }

    func start() async throws {
        guard !isRunning else { return }
        try await connectWithRetry()
        let channelId = try await fetchChannelId()
        try await installAutocmds(channelId: channelId)
        startNotificationLoop()
        try await syncInitialBuffers()
        isRunning = true
    }

    func stop() {
        notificationsTask?.cancel()
        notificationsTask = nil
        rpc.disconnect()
        bufferByURL.removeAll()
        urlByBuffer.removeAll()
        isRunning = false
        terminalView.shutdown()
        try? FileManager.default.removeItem(atPath: socketPath)
    }

    func openFile(_ url: URL, line: Int? = nil, column: Int? = nil) async throws {
        let normalizedURL = url.standardizedFileURL
        if let buf = bufferByURL[normalizedURL] {
            _ = try await rpc.request("nvim_set_current_buf", params: [.int(buf)])
            if let line {
                try await setCursor(line: line, column: column)
            }
            return
        }

        let path = normalizedURL.path
        do {
            let cmd: [String: MsgPackValue] = [
                "cmd": .string("edit"),
                "args": .array([.string(path)])
            ]
            _ = try await rpc.request("nvim_cmd", params: [.map(cmd), .map([:])])
        } catch {
            let escapedValue = try await rpc.request(
                "nvim_call_function",
                params: [.string("fnameescape"), .array([.string(path)])]
            )
            let escapedPath = escapedValue.stringValue ?? path
            _ = try await rpc.request("nvim_command", params: [.string("edit " + escapedPath)])
        }

        if let line {
            try await setCursor(line: line, column: column)
        }

        if let currentBuf = (try? await rpc.request("nvim_get_current_buf", params: []))?.intValue {
            bufferByURL[normalizedURL] = currentBuf
            urlByBuffer[currentBuf] = normalizedURL
        }
    }

    func closeFile(_ url: URL) async {
        let normalizedURL = url.standardizedFileURL
        guard let buf = bufferByURL[normalizedURL] else { return }
        let opts: [String: MsgPackValue] = ["force": .bool(false)]
        _ = try? await rpc.request("nvim_buf_delete", params: [.int(buf), .map(opts)])
    }

    private func connectWithRetry() async throws {
        var lastError: Error?
        for _ in 0..<20 {
            do {
                try await rpc.connect(to: socketPath)
                return
            } catch {
                lastError = error
                try await Task.sleep(nanoseconds: 100_000_000)
            }
        }
        throw lastError ?? ControllerError.connectTimeout
    }

    private func fetchChannelId() async throws -> Int64 {
        let info = try await rpc.request("nvim_get_api_info", params: [])
        guard case let .array(values) = info,
              let channelId = values.first?.intValue else {
            throw ControllerError.invalidResponse
        }
        return channelId
    }

    private func installAutocmds(channelId: Int64) async throws {
        let script = """
        local chan = ...
        local group = vim.api.nvim_create_augroup("Smithers", { clear = true })

        local function emit(event, buf)
          local name = vim.api.nvim_buf_get_name(buf)
          local listed = vim.api.nvim_buf_get_option(buf, "buflisted")
          vim.rpcnotify(chan, "smithers/buf", { event = event, buf = buf, name = name, listed = listed })
        end

        vim.api.nvim_create_autocmd({ "BufEnter", "BufAdd" }, {
          group = group,
          callback = function(args)
            emit("enter", args.buf)
          end,
        })

        vim.api.nvim_create_autocmd({ "BufDelete" }, {
          group = group,
          callback = function(args)
            vim.rpcnotify(chan, "smithers/buf", { event = "delete", buf = args.buf })
          end,
        })
        """

        _ = try await rpc.request(
            "nvim_exec_lua",
            params: [.string(script), .array([.int(channelId)])]
        )
    }

    private func startNotificationLoop() {
        notificationsTask?.cancel()
        notificationsTask = Task { [weak self] in
            guard let self else { return }
            for await (method, params) in self.rpc.notifications {
                if Task.isCancelled { break }
                await self.handleNotification(method: method, params: params)
            }
        }
    }

    private func handleNotification(method: String, params: [MsgPackValue]) async {
        guard method == "smithers/buf" else { return }
        guard let payload = params.first?.mapValue else { return }
        guard let event = payload["event"]?.stringValue else { return }
        let buf = payload["buf"]?.intValue

        switch event {
        case "delete":
            handleBufferDelete(buf: buf)
        default:
            let listed = payload["listed"]?.boolValue ?? false
            guard listed else { return }
            guard let name = payload["name"]?.stringValue else { return }
            handleBufferEnter(buf: buf, name: name, select: true)
        }
    }

    private func handleBufferEnter(buf: Int64?, name: String, select: Bool) {
        guard let buf else { return }
        guard let url = urlFromBufferName(name) else { return }
        bufferByURL[url] = buf
        urlByBuffer[buf] = url
        workspace?.handleNvimBufferEnter(url: url, select: select)
    }

    private func handleBufferDelete(buf: Int64?) {
        guard let buf else { return }
        guard let url = urlByBuffer.removeValue(forKey: buf) else { return }
        bufferByURL.removeValue(forKey: url)
        workspace?.handleNvimBufferDelete(url: url)
    }

    private func syncInitialBuffers() async throws {
        let buffers = try await rpc.request("nvim_list_bufs", params: [])
        guard case let .array(values) = buffers else { return }

        for value in values {
            guard let buf = value.intValue else { continue }
            let nameValue = try await rpc.request("nvim_buf_get_name", params: [.int(buf)])
            guard let name = nameValue.stringValue, !name.isEmpty else { continue }
            let listedValue = try await rpc.request(
                "nvim_buf_get_option",
                params: [.int(buf), .string("buflisted")]
            )
            let listed = listedValue.boolValue ?? false
            guard listed else { continue }
            handleBufferEnter(buf: buf, name: name, select: false)
        }

        let currentValue = try await rpc.request("nvim_get_current_buf", params: [])
        if let currentBuf = currentValue.intValue,
           let url = urlByBuffer[currentBuf] {
            workspace?.handleNvimBufferEnter(url: url, select: true)
        }
    }

    private func setCursor(line: Int, column: Int?) async throws {
        let lineValue = max(1, line)
        let colValue = max(1, column ?? 1) - 1
        let pos: [MsgPackValue] = [.int(Int64(lineValue)), .int(Int64(colValue))]
        _ = try await rpc.request("nvim_win_set_cursor", params: [.int(0), .array(pos)])
    }

    private func urlFromBufferName(_ name: String) -> URL? {
        let trimmed = name.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !trimmed.isEmpty else { return nil }
        guard !trimmed.contains("://") else { return nil }
        let expanded = (trimmed as NSString).expandingTildeInPath
        if expanded.hasPrefix("/") {
            return URL(fileURLWithPath: expanded).standardizedFileURL
        }
        if let root = workspace?.rootDirectory {
            return URL(fileURLWithPath: expanded, relativeTo: root).standardizedFileURL
        }
        return URL(fileURLWithPath: expanded).standardizedFileURL
    }

    static func locateNvimPath() -> String? {
        let fm = FileManager.default
        if let pathEnv = ProcessInfo.processInfo.environment["PATH"] {
            for part in pathEnv.split(separator: ":") {
                let candidate = URL(fileURLWithPath: String(part)).appendingPathComponent("nvim").path
                if fm.isExecutableFile(atPath: candidate) {
                    return candidate
                }
            }
        }

        let candidates = [
            "/opt/homebrew/bin/nvim",
            "/usr/local/bin/nvim",
            "/usr/bin/nvim"
        ]
        for candidate in candidates where fm.isExecutableFile(atPath: candidate) {
            return candidate
        }
        return nil
    }

    private static func shellEscape(_ value: String) -> String {
        if value.isEmpty { return "''" }
        let escaped = value.replacingOccurrences(of: "'", with: "'\\''")
        return "'\(escaped)'"
    }
}

import Foundation

@MainActor
final class CodexCompletionService {
    enum CompletionError: Error, LocalizedError {
        case notRunning
        case turnFailed(String)
        case serviceError(String)

        var errorDescription: String? {
            switch self {
            case .notRunning:
                return "Completion service is not running"
            case .turnFailed(let status):
                return "Completion turn failed: \(status)"
            case .serviceError(let message):
                return message
            }
        }
    }

    private final class CompletionRequest {
        var turnId: String?
        var buffer: String
        let onDelta: @MainActor (String) -> Void
        var continuation: CheckedContinuation<String, Error>?
        var isCompleted = false

        init(turnId: String? = nil, onDelta: @escaping @MainActor (String) -> Void, continuation: CheckedContinuation<String, Error>) {
            self.turnId = turnId
            self.buffer = ""
            self.onDelta = onDelta
            self.continuation = continuation
        }

        func finish(_ result: Result<String, Error>) {
            guard !isCompleted else { return }
            isCompleted = true
            continuation?.resume(with: result)
            continuation = nil
        }
    }

    private let service = CodexService()
    private var eventsTask: Task<Void, Never>?
    private var activeRequest: CompletionRequest?

    func start(cwd: String) async throws {
        guard !service.isRunning else { return }
        _ = try await service.start(cwd: cwd, resumeThreadId: nil)
        eventsTask = Task { @MainActor [weak self] in
            guard let self else { return }
            for await event in service.events {
                self.handle(event)
            }
        }
    }

    func stop() {
        cancelActiveRequest()
        eventsTask?.cancel()
        eventsTask = nil
        service.stop()
    }

    func login(apiKey: String) async throws {
        try await service.login(apiKey: apiKey)
    }

    func requestCompletion(
        prompt: String,
        onDelta: @escaping @MainActor (String) -> Void
    ) async throws -> String {
        guard service.isRunning else { throw CompletionError.notRunning }
        cancelActiveRequest()
        return try await withTaskCancellationHandler(operation: {
            try await withCheckedThrowingContinuation { continuation in
                let request = CompletionRequest(onDelta: onDelta, continuation: continuation)
                activeRequest = request

                Task { @MainActor [weak self] in
                    guard let self else { return }
                    do {
                        let startedTurnId = try await self.service.sendMessage(prompt)
                        if request.turnId == nil {
                            request.turnId = startedTurnId
                        } else if request.turnId != startedTurnId {
                            request.finish(.failure(CompletionError.serviceError("Mismatched turnId")))
                            self.activeRequest = nil
                        }
                    } catch {
                        request.finish(.failure(error))
                        self.activeRequest = nil
                    }
                }
            }
        }, onCancel: {
            Task { @MainActor [weak self] in
                self?.cancelActiveRequest()
            }
        })
    }

    func cancelActiveRequest() {
        if let activeRequest {
            activeRequest.finish(.failure(CancellationError()))
        }
        activeRequest = nil
        Task { @MainActor [weak self] in
            try? await self?.service.interrupt()
        }
    }

    private func handle(_ event: CodexEvent) {
        guard let activeRequest else { return }
        func matches(_ turnId: String) -> Bool {
            if activeRequest.turnId == nil {
                activeRequest.turnId = turnId
                return true
            }
            return activeRequest.turnId == turnId
        }

        switch event {
        case .agentMessageDelta(let turnId, let text):
            guard matches(turnId) else { return }
            activeRequest.buffer += text
            activeRequest.onDelta(activeRequest.buffer)
        case .agentMessageCompleted(let turnId, let text):
            guard matches(turnId) else { return }
            activeRequest.finish(.success(text))
            self.activeRequest = nil
        case .turnCompleted(let turnId, let status):
            guard matches(turnId) else { return }
            if status == "completed" {
                activeRequest.finish(.success(activeRequest.buffer))
                self.activeRequest = nil
                return
            }
            activeRequest.finish(.failure(CompletionError.turnFailed(status)))
            self.activeRequest = nil
        case .error(let message):
            activeRequest.finish(.failure(CompletionError.serviceError(message)))
            self.activeRequest = nil
        default:
            break
        }
    }
}

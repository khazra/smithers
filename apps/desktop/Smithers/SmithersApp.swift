import SwiftUI

@main
struct SmithersApp: App {
    @StateObject private var workspace = WorkspaceState()

    var body: some Scene {
        WindowGroup {
            ContentView(workspace: workspace)
                .preferredColorScheme(.dark)
                .onAppear {
                    handleLaunchArguments()
                }
        }
        .commands {
            CommandGroup(after: .newItem) {
                Button("Open Folder...") {
                    workspace.openFolderPanel()
                }
                .keyboardShortcut("O", modifiers: [.command, .shift])
            }
        }
    }

    private func handleLaunchArguments() {
        let args = ProcessInfo.processInfo.arguments
        if let idx = args.firstIndex(of: "-openDirectory"),
           idx + 1 < args.count {
            let path = args[idx + 1]
            let url = URL(fileURLWithPath: path)
            workspace.openDirectory(url)
        }
    }
}

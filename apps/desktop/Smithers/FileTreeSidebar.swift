import SwiftUI

struct FileTreeSidebar: View {
    @ObservedObject var workspace: WorkspaceState

    var body: some View {
        Group {
            if workspace.fileTree.isEmpty {
                VStack(spacing: 12) {
                    Text("No folder open")
                        .foregroundStyle(.secondary)
                        .accessibilityIdentifier("NoFolderLabel")
                    Button("Open Folder...") {
                        workspace.openFolderPanel()
                    }
                    .accessibilityIdentifier("OpenFolderButton")
                }
                .frame(maxWidth: .infinity, maxHeight: .infinity)
            } else {
                List(selection: $workspace.selectedFileURL) {
                    OutlineGroup(workspace.fileTree, children: \.children) { item in
                        Label {
                            Text(item.name)
                        } icon: {
                            Image(systemName: item.isFolder ? "folder.fill" : "doc.text")
                                .foregroundStyle(item.isFolder ? .blue : .secondary)
                        }
                        .tag(item.id)
                        .accessibilityIdentifier("FileTreeItem_\(item.name)")
                    }
                }
                .listStyle(.sidebar)
                .accessibilityIdentifier("FileTreeList")
                .onChange(of: workspace.selectedFileURL) { _, newValue in
                    if let url = newValue {
                        workspace.selectFile(url)
                    }
                }
            }
        }
    }
}

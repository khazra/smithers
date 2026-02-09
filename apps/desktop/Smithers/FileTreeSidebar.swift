import SwiftUI

struct FileTreeSidebar: View {
    @ObservedObject var workspace: WorkspaceState

    var body: some View {
        let theme = workspace.preferences.theme
        let topInset: CGFloat = 38
        Group {
            if workspace.fileTree.isEmpty {
                VStack(spacing: 16) {
                    Image(systemName: "folder.badge.plus")
                        .font(.system(size: Typography.iconL))
                        .foregroundStyle(.secondary)
                    Text("No Folder Open")
                        .font(.system(size: Typography.l, weight: .semibold))
                        .foregroundStyle(.secondary)
                        .accessibilityIdentifier("NoFolderLabel")
                    Button {
                        workspace.openFolderPanel()
                    } label: {
                        Text("Open Folder...")
                            .frame(minWidth: 120)
                    }
                    .controlSize(.large)
                    .accessibilityIdentifier("OpenFolderButton")
                    Text("⌘⇧O")
                        .font(.system(size: Typography.s))
                        .foregroundStyle(.tertiary)
                }
                .frame(maxWidth: .infinity, maxHeight: .infinity)
                .background(theme.secondaryBackgroundColor)
            } else {
                List(selection: $workspace.selectedFileURL) {
                    Section(workspace.rootDirectory?.lastPathComponent ?? "Files") {
                        ForEach(workspace.fileTree) { item in
                            FileTreeRow(item: item, workspace: workspace, level: 0)
                        }
                    }
                }
                .listStyle(.sidebar)
                .scrollContentBackground(.hidden)
                .background(theme.secondaryBackgroundColor)
                .accessibilityIdentifier("FileTreeList")
                .onChange(of: workspace.selectedFileURL) { _, newValue in
                    if let url = newValue {
                        workspace.selectFile(url)
                    }
                }
            }
        }
        .padding(.top, topInset)
    }
}


struct FileTreeRow: View {
    let item: FileItem
    @ObservedObject var workspace: WorkspaceState
    let level: Int
    @State private var isExpanded = false
    @State private var isHovered = false
    private let indentWidth: CGFloat = 16

    var body: some View {
        if item.isFolder {
            folderRow
        } else {
            rowChrome {
                fileLabel
            }
            .contextMenu { fileContextMenu }
                .tag(item.id)
                .accessibilityIdentifier("FileTreeItem_\(item.name)")
        }
    }

    @ViewBuilder
    private var folderRow: some View {
        VStack(alignment: .leading, spacing: 0) {
            rowChrome {
                let theme = workspace.preferences.theme
                HStack(spacing: 5) {
                    Image(systemName: "chevron.right")
                        .font(.system(size: 9, weight: .semibold))
                        .foregroundStyle(theme.mutedForegroundColor.opacity(0.5))
                        .rotationEffect(isExpanded ? .degrees(90) : .zero)
                        .animation(.easeInOut(duration: 0.15), value: isExpanded)
                        .frame(width: 16, height: 16)
                    Image(systemName: isExpanded ? "folder.fill" : "folder")
                        .foregroundStyle(theme.accentColor.opacity(0.6))
                        .font(.system(size: Typography.s))
                    Text(item.name)
                        .font(.system(size: Typography.s, weight: .medium))
                        .foregroundStyle(theme.foregroundColor.opacity(0.85))
                        .lineLimit(1)
                        .truncationMode(.middle)
                    Spacer()
                }
                .frame(height: 26)
                .contentShape(Rectangle())
                .background(
                    RoundedRectangle(cornerRadius: 4, style: .continuous)
                        .fill(isHovered ? theme.selectionBackgroundColor.opacity(0.4) : Color.clear)
                )
                .onTapGesture {
                    if !isExpanded {
                        workspace.expandFolder(item)
                    }
                    isExpanded.toggle()
                }
                .onHover { isHovered = $0 }
                .accessibilityIdentifier("FileTreeItem_\(item.name)")
            }
            .contextMenu { folderContextMenu }

            if isExpanded, let children = item.children {
                let visibleChildren = children.filter { !$0.isLazyPlaceholder }
                ForEach(visibleChildren) { child in
                    FileTreeRow(item: child, workspace: workspace, level: level + 1)
                        .transition(.move(edge: .top).combined(with: .opacity))
                }
            }
        }
    }

    private var fileLabel: some View {
        let isModified = workspace.isFileModified(item.id)
        let isSelected = workspace.selectedFileURL == item.id
        let theme = workspace.preferences.theme

        return HStack(spacing: 6) {
            Image(systemName: iconForFile(item.name))
                .foregroundStyle(colorForFile(item.name)?.opacity(0.65) ?? theme.mutedForegroundColor)
                .font(.system(size: Typography.s))
            Text(item.name)
                .font(.system(size: Typography.s))
                .lineLimit(1)
                .truncationMode(.middle)
                .foregroundStyle(isSelected ? theme.foregroundColor : theme.foregroundColor.opacity(0.8))
            if isModified {
                Circle()
                    .fill(theme.accentColor.opacity(0.7))
                    .frame(width: 5, height: 5)
                    .accessibilityLabel("Unsaved changes")
            }
            Spacer()
        }
        .frame(height: 26)
        .padding(.vertical, 1)
        .background(
            RoundedRectangle(cornerRadius: 4, style: .continuous)
                .fill(isHovered && !isSelected ? theme.selectionBackgroundColor.opacity(0.5) : Color.clear)
        )
        .overlay(alignment: .leading) {
            if isSelected {
                Capsule()
                    .fill(theme.accentColor)
                    .frame(width: 2, height: 14)
            }
        }
        .onHover { isHovered = $0 }
    }

    private var fileContextMenu: some View {
        Group {
            Button("Copy Path") { workspace.copyFilePath(item.id) }
            Button("Copy Relative Path") { workspace.copyRelativeFilePath(item.id) }
            Divider()
            Button("Reveal in Finder") { workspace.revealInFinder(item.id) }
            Button("Open in Terminal") { workspace.openInTerminal(item.id) }
            Divider()
            Button("Rename...") { workspace.renameItem(item) }
            Button("Delete", role: .destructive) { workspace.deleteItem(item) }
        }
    }

    private var folderContextMenu: some View {
        Group {
            Button("New File") { workspace.createFile(in: item.id) }
            Button("New Folder") { workspace.createFolder(in: item.id) }
            Divider()
            Button("Copy Path") { workspace.copyFilePath(item.id) }
            Button("Copy Relative Path") { workspace.copyRelativeFilePath(item.id) }
            Divider()
            Button("Reveal in Finder") { workspace.revealInFinder(item.id) }
            Button("Open in Terminal") { workspace.openInTerminal(item.id) }
            Divider()
            Button("Rename...") { workspace.renameItem(item) }
            Button("Delete", role: .destructive) { workspace.deleteItem(item) }
        }
    }

    private var rowIndent: CGFloat {
        CGFloat(level) * indentWidth
    }

    @ViewBuilder
    private func rowChrome<Content: View>(@ViewBuilder content: () -> Content) -> some View {
        content()
            .padding(.leading, rowIndent)
            .background(alignment: .leading) {
                if level > 0 {
                    IndentGuides(
                        level: level,
                        indent: indentWidth,
                        color: workspace.preferences.theme.dividerColor.opacity(0.35)
                    )
                }
            }
    }
}

private struct IndentGuides: View {
    let level: Int
    let indent: CGFloat
    let color: Color

    var body: some View {
        GeometryReader { proxy in
            Path { path in
                let height = proxy.size.height
                for index in 0..<level {
                    let x = indent * CGFloat(index) + (indent / 2)
                    path.move(to: CGPoint(x: x, y: 0))
                    path.addLine(to: CGPoint(x: x, y: height))
                }
            }
            .stroke(color, lineWidth: 1)
        }
        .allowsHitTesting(false)
    }
}

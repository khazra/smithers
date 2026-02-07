import Foundation

struct FileItem: Identifiable, Hashable {
    let id: URL
    let name: String
    let isFolder: Bool
    var children: [FileItem]?

    // MARK: - Lazy Loading Sentinel

    static let lazyPlaceholderURL = URL(fileURLWithPath: "/__smithers_lazy_placeholder__")

    static var lazyPlaceholder: FileItem {
        FileItem(id: lazyPlaceholderURL, name: "__lazy_placeholder__", isFolder: false, children: nil)
    }

    var isLazyPlaceholder: Bool {
        id == Self.lazyPlaceholderURL
    }

    var needsLoading: Bool {
        guard isFolder, let children else { return false }
        return children.count == 1 && children[0].isLazyPlaceholder
    }

    // MARK: - Loading

    static func loadTree(at url: URL) -> [FileItem] {
        loadShallowChildren(of: url)
    }

    static func loadShallowChildren(of url: URL) -> [FileItem] {
        let fm = FileManager.default
        guard let contents = try? fm.contentsOfDirectory(
            at: url,
            includingPropertiesForKeys: [.isDirectoryKey],
            options: [.skipsHiddenFiles]
        ) else {
            return []
        }

        let items: [FileItem] = contents.compactMap { childURL in
            let isDir = (try? childURL.resourceValues(forKeys: [.isDirectoryKey]).isDirectory) ?? false
            return FileItem(
                id: childURL,
                name: childURL.lastPathComponent,
                isFolder: isDir,
                children: isDir ? [lazyPlaceholder] : nil
            )
        }

        return items.sorted { lhs, rhs in
            if lhs.isFolder != rhs.isFolder { return lhs.isFolder }
            return lhs.name.localizedStandardCompare(rhs.name) == .orderedAscending
        }
    }

    // MARK: - Tree Mutation

    static func replaceChildren(in tree: inout [FileItem], for targetURL: URL, with newChildren: [FileItem]) {
        for i in tree.indices {
            if tree[i].id == targetURL {
                tree[i].children = newChildren
                return
            }
            if tree[i].isFolder, tree[i].children != nil {
                var subtree = tree[i].children!
                replaceChildren(in: &subtree, for: targetURL, with: newChildren)
                tree[i].children = subtree
            }
        }
    }
}

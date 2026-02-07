import Foundation

struct FileItem: Identifiable, Hashable {
    let id: URL
    let name: String
    let isFolder: Bool
    var children: [FileItem]?

    static func loadTree(at url: URL) -> [FileItem] {
        loadChildren(of: url)
    }

    static func loadChildren(of url: URL) -> [FileItem] {
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
                children: isDir ? loadChildren(of: childURL) : nil
            )
        }

        return items.sorted { lhs, rhs in
            if lhs.isFolder != rhs.isFolder { return lhs.isFolder }
            return lhs.name.localizedStandardCompare(rhs.name) == .orderedAscending
        }
    }
}

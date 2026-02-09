import SwiftUI

struct TabBarItem: View {
    let title: String
    let subtitle: String
    let icon: String
    let isSelected: Bool
    let isModified: Bool
    let isDropTarget: Bool
    let theme: AppTheme
    let onSelect: () -> Void
    let onClose: () -> Void
    @State private var isHovered = false

    var body: some View {
        let helpText = isModified ? "\(subtitle)\nUnsaved changes" : subtitle
        let fileColor = colorForFile(title)
        let showClose = isModified ? isHovered : (isHovered || isSelected)
        let showDot = isModified && !isHovered
        let borderColor = isDropTarget
            ? theme.accentColor
            : (isSelected ? theme.tabBorderColor : theme.tabBorderColor.opacity(0.6))
        HStack(spacing: 6) {
            Image(systemName: icon)
                .font(.system(size: Typography.base))
                .foregroundStyle(fileColor?.opacity(0.8) ?? theme.mutedForegroundColor)
            Text(title)
                .font(.system(size: Typography.base, weight: .medium))
                .lineLimit(1)
                .truncationMode(.middle)
                .foregroundStyle(isSelected ? theme.tabSelectedForegroundColor : theme.tabForegroundColor)
            ZStack {
                if showDot {
                    let dotColor = isSelected ? theme.tabSelectedForegroundColor : theme.accentColor
                    Circle()
                        .fill(dotColor)
                        .frame(width: 7, height: 7)
                        .accessibilityLabel("Unsaved changes")
                        .transition(.opacity)
                }
                Button(action: onClose) {
                    Image(systemName: "xmark")
                        .font(.system(size: Typography.xs, weight: .bold))
                        .foregroundStyle(theme.mutedForegroundColor)
                        .padding(4)
                }
                .buttonStyle(.plain)
                .opacity(showClose ? 1 : 0)
                .allowsHitTesting(showClose)
                .accessibilityLabel("Close \(title)")
            }
            .frame(width: 18, height: 18)
            .animation(.easeInOut(duration: 0.12), value: showClose)
            .animation(.easeInOut(duration: 0.12), value: showDot)
        }
        .padding(.horizontal, 10)
        .padding(.vertical, 6)
        .background(
            RoundedRectangle(cornerRadius: 6, style: .continuous)
                .fill(isSelected ? theme.tabSelectedBackgroundColor : (isHovered ? theme.tabSelectedBackgroundColor.opacity(0.5) : Color.clear))
        )
        .overlay(
            RoundedRectangle(cornerRadius: 6, style: .continuous)
                .strokeBorder(borderColor)
        )
        .overlay(alignment: .bottom) {
            if isSelected {
                Rectangle()
                    .fill(theme.accentColor)
                    .frame(height: 2)
            }
        }
        .contentShape(RoundedRectangle(cornerRadius: 6, style: .continuous))
        .onTapGesture(perform: onSelect)
        .onHover { isHovered = $0 }
        .help(helpText)
    }
}

func iconForFile(_ name: String) -> String {
    let ext = (name as NSString).pathExtension.lowercased()
    switch ext {
    case "swift": return "swift"
    case "py": return "text.page"
    case "js", "ts", "jsx", "tsx": return "curlybraces"
    case "json": return "curlybraces.square"
    case "md", "txt", "readme": return "doc.plaintext"
    case "yml", "yaml", "toml": return "gearshape"
    case "png", "jpg", "jpeg", "gif", "svg", "webp", "ico": return "photo"
    case "html", "css": return "globe"
    case "sh", "zsh", "bash": return "terminal"
    case "zip", "tar", "gz": return "doc.zipper"
    case "resolved": return "lock"
    default: return "doc.text"
    }
}

func colorForFile(_ name: String) -> Color? {
    let ext = (name as NSString).pathExtension.lowercased()
    switch ext {
    case "swift": return .orange
    case "py": return Color(red: 0.3, green: 0.6, blue: 0.9)
    case "js": return .yellow
    case "ts", "tsx": return Color(red: 0.2, green: 0.5, blue: 0.8)
    case "json": return .yellow.opacity(0.8)
    case "md": return Color(red: 0.5, green: 0.7, blue: 0.9)
    case "html": return .orange
    case "css": return Color(red: 0.3, green: 0.5, blue: 0.8)
    case "sh", "zsh", "bash": return .green
    default: return nil
    }
}

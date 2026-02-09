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
        let showClose = isModified ? isHovered : isHovered
        let showDot = isModified && !isHovered
        HStack(spacing: 5) {
            Image(systemName: icon)
                .font(.system(size: Typography.s))
                .foregroundStyle(fileColor?.opacity(0.7) ?? theme.mutedForegroundColor)
            Text(title)
                .font(.system(size: Typography.s, weight: isSelected ? .semibold : .regular))
                .lineLimit(1)
                .truncationMode(.middle)
                .foregroundStyle(isSelected ? theme.tabSelectedForegroundColor : theme.tabForegroundColor)
            ZStack {
                if showDot {
                    Circle()
                        .fill(theme.accentColor.opacity(0.8))
                        .frame(width: 6, height: 6)
                        .accessibilityLabel("Unsaved changes")
                        .transition(.opacity)
                }
                Button(action: onClose) {
                    Image(systemName: "xmark")
                        .font(.system(size: 8, weight: .semibold))
                        .foregroundStyle(theme.mutedForegroundColor.opacity(0.6))
                        .padding(3)
                }
                .buttonStyle(.plain)
                .opacity(showClose ? 1 : 0)
                .allowsHitTesting(showClose)
                .accessibilityLabel("Close \(title)")
            }
            .frame(width: 16, height: 16)
            .animation(.easeInOut(duration: 0.12), value: showClose)
            .animation(.easeInOut(duration: 0.12), value: showDot)
        }
        .padding(.horizontal, 8)
        .padding(.vertical, 5)
        .background(
            RoundedRectangle(cornerRadius: 6, style: .continuous)
                .fill(isSelected ? theme.tabSelectedBackgroundColor : (isHovered ? theme.tabSelectedBackgroundColor.opacity(0.4) : Color.clear))
        )
        .overlay(
            RoundedRectangle(cornerRadius: 6, style: .continuous)
                .strokeBorder(isDropTarget ? theme.accentColor.opacity(0.5) : Color.clear, lineWidth: 1)
        )
        .overlay(alignment: .bottom) {
            if isSelected {
                Capsule()
                    .fill(theme.accentColor)
                    .frame(width: 16, height: 2)
                    .padding(.bottom, 1)
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

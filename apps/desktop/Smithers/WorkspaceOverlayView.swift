import SwiftUI

struct WorkspaceOverlayView: View {
    let overlay: OverlayContent
    let theme: AppTheme
    let onDismiss: () -> Void

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            header
            content
            if overlay.type == .progress {
                ProgressView(value: overlay.progress ?? 0)
                    .progressViewStyle(.linear)
                    .tint(theme.accentColor)
            }
        }
        .padding(14)
        .frame(maxWidth: 520, alignment: .leading)
        .background(
            RoundedRectangle(cornerRadius: 12, style: .continuous)
                .fill(theme.panelBackgroundColor)
        )
        .overlay(
            RoundedRectangle(cornerRadius: 12, style: .continuous)
                .strokeBorder(theme.panelBorderColor)
        )
        .shadow(color: .black.opacity(0.25), radius: 10, x: 0, y: 6)
        .padding(.horizontal, 20)
        .accessibilityIdentifier("WorkspaceOverlay")
    }

    @ViewBuilder
    private var header: some View {
        HStack(spacing: 8) {
            if overlay.type == .chat {
                Image(systemName: "sparkles")
                    .foregroundStyle(theme.accentColor)
            }
            Text(overlay.title ?? defaultTitle)
                .font(.system(size: Typography.s, weight: .semibold))
                .foregroundStyle(theme.foregroundColor)
            Spacer(minLength: 8)
            Button(action: onDismiss) {
                Image(systemName: "xmark.circle.fill")
                    .foregroundStyle(theme.mutedForegroundColor)
            }
            .buttonStyle(.plain)
        }
    }

    @ViewBuilder
    private var content: some View {
        switch overlay.type {
        case .panel:
            Text(.init(overlay.message))
                .font(.system(size: Typography.s))
                .foregroundStyle(theme.foregroundColor)
        case .chat:
            Text(overlay.message)
                .font(.system(size: Typography.s))
                .foregroundStyle(theme.foregroundColor)
        case .progress:
            Text(overlay.message)
                .font(.system(size: Typography.s))
                .foregroundStyle(theme.foregroundColor)
        }
    }

    private var defaultTitle: String {
        switch overlay.type {
        case .chat:
            return "Assistant"
        case .progress:
            return "Working"
        case .panel:
            return "Details"
        }
    }
}

extension OverlayPosition {
    var alignment: Alignment {
        switch self {
        case .bottom:
            return .bottom
        case .center:
            return .center
        case .top:
            return .top
        }
    }

    var transitionEdge: Edge {
        switch self {
        case .bottom:
            return .bottom
        case .center:
            return .top
        case .top:
            return .top
        }
    }
}

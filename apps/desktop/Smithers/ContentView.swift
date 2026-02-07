import SwiftUI
import STTextView

struct CodeEditor: NSViewRepresentable {
    @Binding var text: String

    func makeNSView(context: Context) -> NSScrollView {
        let scrollView = STTextView.scrollableTextView()
        let textView = scrollView.documentView as! STTextView

        textView.font = .monospacedSystemFont(ofSize: 13, weight: .regular)
        textView.backgroundColor = NSColor(white: 0.12, alpha: 1)
        textView.insertionPointColor = .white
        textView.highlightSelectedLine = true
        textView.selectedLineHighlightColor = NSColor(white: 0.18, alpha: 1)
        textView.widthTracksTextView = true
        textView.textColor = .white
        textView.delegate = context.coordinator

        setTextViewContent(textView, text: text)

        scrollView.backgroundColor = NSColor(white: 0.12, alpha: 1)
        scrollView.setAccessibilityIdentifier("CodeEditor")
        textView.setAccessibilityIdentifier("CodeEditorTextView")

        return scrollView
    }

    func updateNSView(_ scrollView: NSScrollView, context: Context) {
        guard let textView = scrollView.documentView as? STTextView else { return }
        let current = textView.attributedString().string
        if current != text {
            context.coordinator.ignoreNextChange = true
            setTextViewContent(textView, text: text)
        }
    }

    private func setTextViewContent(_ textView: STTextView, text: String) {
        let attrs: [NSAttributedString.Key: Any] = [
            .foregroundColor: NSColor.white,
            .font: NSFont.monospacedSystemFont(ofSize: 13, weight: .regular),
        ]
        textView.setAttributedString(NSAttributedString(string: text, attributes: attrs))
        let fullRange = NSRange(location: 0, length: (text as NSString).length)
        textView.setTextColor(.white, range: fullRange)
    }

    func makeCoordinator() -> Coordinator {
        Coordinator(parent: self)
    }

    class Coordinator: NSObject, STTextViewDelegate {
        var parent: CodeEditor
        var ignoreNextChange = false

        init(parent: CodeEditor) {
            self.parent = parent
        }

        func textViewDidChangeText(_ notification: Notification) {
            if ignoreNextChange {
                ignoreNextChange = false
                return
            }
            guard let textView = notification.object as? STTextView else { return }
            parent.text = textView.attributedString().string
        }
    }
}

struct ContentView: View {
    @ObservedObject var workspace: WorkspaceState

    var body: some View {
        NavigationSplitView {
            FileTreeSidebar(workspace: workspace)
        } detail: {
            CodeEditor(text: $workspace.editorText)
                .frame(maxWidth: .infinity, maxHeight: .infinity)
        }
    }
}

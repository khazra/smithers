import Foundation

struct NvimViewport: Equatable {
    let topLine: Int
    let bottomLine: Int
    let lineCount: Int

    var visibleLineCount: Int {
        max(1, bottomLine - topLine + 1)
    }
}

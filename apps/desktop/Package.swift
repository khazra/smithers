// swift-tools-version: 5.10
import PackageDescription

let package = Package(
    name: "Smithers",
    platforms: [.macOS(.v14)],
    products: [
        .executable(name: "Smithers", targets: ["Smithers"]),
    ],
    dependencies: [
        .package(url: "https://github.com/krzyzanowskim/STTextView.git", from: "0.9.0"),
    ],
    targets: [
        .executableTarget(
            name: "Smithers",
            dependencies: [
                .product(name: "STTextView", package: "STTextView"),
            ],
            path: "Smithers"
        ),
    ]
)

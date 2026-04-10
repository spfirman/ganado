import SwiftUI
import RealityKit

struct HerdVisualizationView: View {
    let cattle: [Cattle]

    var body: some View {
        RealityView { content in
            let anchor = AnchorEntity(.head)
            anchor.position = [0, 0, -1.5]

            // Create 3D spheres representing cattle categories
            let categories: [(label: String, count: Int, color: UIColor, xOffset: Float)] = [
                ("Bulls", cattle.filter { $0.gender == .male }.count, .systemIndigo, -0.4),
                ("Cows", cattle.filter { $0.gender == .female }.count, .systemPink, 0.0),
                ("Other", cattle.filter { $0.gender == nil }.count, .systemGray, 0.4)
            ]

            for category in categories {
                guard category.count > 0 else { continue }

                let radius = Float(min(max(Double(category.count) / 100.0, 0.05), 0.2))
                let mesh = MeshResource.generateSphere(radius: radius)
                let material = SimpleMaterial(color: category.color, roughness: 0.3, isMetallic: false)
                let entity = ModelEntity(mesh: mesh, materials: [material])
                entity.position = [category.xOffset, 0, 0]

                // Add collision for tap interaction
                entity.components.set(InputTargetComponent())
                entity.generateCollisionShapes(recursive: false)

                anchor.addChild(entity)

                // Count label below sphere
                let textMesh = MeshResource.generateText(
                    "\(category.label)\n\(category.count)",
                    extrusionDepth: 0.002,
                    font: .systemFont(ofSize: 0.03),
                    containerFrame: .zero,
                    alignment: .center,
                    lineBreakMode: .byWordWrapping
                )
                let textMaterial = SimpleMaterial(color: .white, roughness: 1.0, isMetallic: false)
                let textEntity = ModelEntity(mesh: textMesh, materials: [textMaterial])
                textEntity.position = [category.xOffset - 0.05, -radius - 0.05, 0]
                anchor.addChild(textEntity)
            }

            content.add(anchor)
        }
    }
}

import SwiftUI
import RealityKit

struct PastureTerrainView: View {
    let pastures: [Pasture]

    var body: some View {
        RealityView { content in
            let anchor = AnchorEntity(.head)
            anchor.position = [0, -0.3, -1.5]

            // Create a base terrain plane
            let baseMesh = MeshResource.generatePlane(width: 1.0, depth: 0.8)
            let baseMaterial = SimpleMaterial(color: .init(red: 0.3, green: 0.5, blue: 0.2, alpha: 1.0), roughness: 0.8, isMetallic: false)
            let baseEntity = ModelEntity(mesh: baseMesh, materials: [baseMaterial])
            anchor.addChild(baseEntity)

            // Place pastures as colored sections on the terrain
            let gridCols = max(Int(ceil(sqrt(Double(pastures.count)))), 1)
            let cellWidth: Float = 0.9 / Float(gridCols)

            for (index, pasture) in pastures.enumerated() {
                let row = index / gridCols
                let col = index % gridCols

                let x = Float(col) * cellWidth - 0.4 + cellWidth / 2
                let z = Float(row) * cellWidth - 0.35 + cellWidth / 2

                let color: UIColor = {
                    switch pasture.status {
                    case .ACTIVE: return .systemGreen
                    case .RESTING: return .systemBlue
                    case .OVER_GRAZED: return .systemRed
                    case nil: return .systemGray
                    }
                }()

                let paddockMesh = MeshResource.generateBox(width: cellWidth * 0.85, height: 0.02, depth: cellWidth * 0.85)
                let paddockMaterial = SimpleMaterial(color: color, roughness: 0.6, isMetallic: false)
                let paddockEntity = ModelEntity(mesh: paddockMesh, materials: [paddockMaterial])
                paddockEntity.position = [x, 0.015, z]

                paddockEntity.components.set(InputTargetComponent())
                paddockEntity.generateCollisionShapes(recursive: false)

                anchor.addChild(paddockEntity)

                // Pasture name label
                let label = MeshResource.generateText(
                    pasture.displayName,
                    extrusionDepth: 0.001,
                    font: .systemFont(ofSize: 0.015),
                    containerFrame: .zero,
                    alignment: .center,
                    lineBreakMode: .byTruncatingTail
                )
                let labelMat = SimpleMaterial(color: .white, roughness: 1.0, isMetallic: false)
                let labelEntity = ModelEntity(mesh: label, materials: [labelMat])
                labelEntity.position = [x - 0.03, 0.03, z]
                anchor.addChild(labelEntity)

                // Add cattle count indicators (small spheres)
                let count = min(pasture.currentCount ?? 0, 10)
                for i in 0..<count {
                    let dotMesh = MeshResource.generateSphere(radius: 0.005)
                    let dotMat = SimpleMaterial(color: .white, roughness: 0.5, isMetallic: false)
                    let dot = ModelEntity(mesh: dotMesh, materials: [dotMat])
                    let angle = Float(i) * (2 * .pi / Float(max(count, 1)))
                    let r: Float = cellWidth * 0.25
                    dot.position = [x + cos(angle) * r, 0.035, z + sin(angle) * r]
                    anchor.addChild(dot)
                }
            }

            content.add(anchor)
        }
    }
}

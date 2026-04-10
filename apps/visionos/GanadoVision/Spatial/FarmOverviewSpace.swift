import SwiftUI
import RealityKit

struct FarmOverviewSpace: View {
    @EnvironmentObject var authService: AuthService
    @StateObject private var cattleVM = CattleViewModel()
    @StateObject private var pastureVM = PastureViewModel()

    var body: some View {
        RealityView { content in
            // Base ground plane
            let ground = ModelEntity(
                mesh: .generatePlane(width: 3, depth: 3),
                materials: [SimpleMaterial(color: .init(red: 0.25, green: 0.45, blue: 0.15, alpha: 1.0), roughness: 0.9, isMetallic: false)]
            )
            ground.position = [0, -0.5, -2]
            content.add(ground)

            // Farm name marker
            let titleMesh = MeshResource.generateText(
                "GPCB Ganado",
                extrusionDepth: 0.01,
                font: .boldSystemFont(ofSize: 0.08),
                containerFrame: .zero,
                alignment: .center,
                lineBreakMode: .byWordWrapping
            )
            let titleEntity = ModelEntity(mesh: titleMesh, materials: [SimpleMaterial(color: .white, roughness: 0.5, isMetallic: true)])
            titleEntity.position = [-0.4, 0.3, -2]
            content.add(titleEntity)

        } update: { content in
            // Remove old dynamic entities
            for entity in content.entities {
                if entity.name.hasPrefix("dynamic_") {
                    entity.removeFromParent()
                }
            }

            // Add cattle clusters based on loaded data
            let categories: [(label: String, cattle: [Cattle], color: UIColor, position: SIMD3<Float>)] = [
                ("Bulls", cattleVM.cattle.filter { $0.gender == .male }, .systemIndigo, [-0.8, -0.45, -2.5]),
                ("Cows", cattleVM.cattle.filter { $0.gender == .female }, .systemPink, [0, -0.45, -2.5]),
                ("Other", cattleVM.cattle.filter { $0.gender == nil }, .systemGray, [0.8, -0.45, -2.5])
            ]

            for category in categories {
                guard !category.cattle.isEmpty else { continue }

                let count = category.cattle.count
                let radius = Float(min(max(Double(count) / 50.0, 0.1), 0.4))
                let sphere = ModelEntity(
                    mesh: .generateSphere(radius: radius),
                    materials: [SimpleMaterial(color: category.color, roughness: 0.3, isMetallic: false)]
                )
                sphere.name = "dynamic_\(category.label)"
                sphere.position = category.position
                sphere.components.set(InputTargetComponent())
                sphere.generateCollisionShapes(recursive: false)
                content.add(sphere)

                let label = ModelEntity(
                    mesh: .generateText(
                        "\(category.label): \(count)",
                        extrusionDepth: 0.005,
                        font: .systemFont(ofSize: 0.04),
                        containerFrame: .zero,
                        alignment: .center,
                        lineBreakMode: .byWordWrapping
                    ),
                    materials: [SimpleMaterial(color: .white, roughness: 1.0, isMetallic: false)]
                )
                label.name = "dynamic_label_\(category.label)"
                label.position = [category.position.x - 0.06, category.position.y + radius + 0.05, category.position.z]
                content.add(label)
            }

            // Add pasture blocks
            for (index, pasture) in pastureVM.pastures.enumerated() {
                let x = Float(index % 4) * 0.6 - 0.9
                let z: Float = Float(index / 4) * 0.5 - 1.5

                let color: UIColor = {
                    switch pasture.status {
                    case .ACTIVE: return .systemGreen
                    case .RESTING: return .init(red: 0.3, green: 0.6, blue: 0.9, alpha: 1)
                    case .OVER_GRAZED: return .systemOrange
                    case nil: return .systemGray
                    }
                }()

                let area = Float(pasture.areaHectares ?? 1.0) / 20.0
                let size = min(max(area, 0.15), 0.5)

                let block = ModelEntity(
                    mesh: .generateBox(width: size, height: 0.03, depth: size),
                    materials: [SimpleMaterial(color: color, roughness: 0.7, isMetallic: false)]
                )
                block.name = "dynamic_pasture_\(pasture.id)"
                block.position = [x, -0.48, z - 2]
                block.components.set(InputTargetComponent())
                block.generateCollisionShapes(recursive: false)
                content.add(block)
            }
        }
        .task {
            await cattleVM.loadCattle(reset: true)
            await pastureVM.loadPastures(reset: true)
        }
    }
}

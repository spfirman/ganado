import RealityKit
import SwiftUI

class CattleEntity: Entity {
    let cattleData: Cattle

    init(cattle: Cattle) {
        self.cattleData = cattle
        super.init()

        let color: UIColor = {
            switch cattle.gender {
            case .male: return .systemIndigo
            case .female: return .systemPink
            case nil: return .systemGray
            }
        }()

        // Body
        let bodyMesh = MeshResource.generateBox(width: 0.04, height: 0.025, depth: 0.06)
        let bodyMaterial = SimpleMaterial(color: color, roughness: 0.5, isMetallic: false)
        let body = ModelEntity(mesh: bodyMesh, materials: [bodyMaterial])
        addChild(body)

        // Head
        let headMesh = MeshResource.generateSphere(radius: 0.012)
        let head = ModelEntity(mesh: headMesh, materials: [bodyMaterial])
        head.position = [0, 0.005, 0.035]
        addChild(head)

        // Make tappable
        components.set(InputTargetComponent())
        let shape = ShapeResource.generateBox(width: 0.05, height: 0.03, depth: 0.07)
        components.set(CollisionComponent(shapes: [shape]))
    }

    @MainActor required init() {
        self.cattleData = Cattle(
            id: "", idTenant: nil, sysNumber: nil, number: nil,
            receivedAt: nil, receivedWeight: nil, idPurchase: nil,
            purchaseWeight: nil, purchasePrice: nil, idLot: nil,
            idBrand: nil, color: nil, eartagLeft: nil, eartagRight: nil,
            idDevice: nil, castrated: nil, castrationDate: nil,
            comments: nil, status: nil, gender: nil, birthDateAprx: nil,
            newFeedStartDate: nil, purchaseCommission: nil,
            negotiatedPricePerKg: nil, lotPricePerWeight: nil,
            salePrice: nil, salePricePerKg: nil, saleWeight: nil,
            averageGr: nil, averageDailyGain: nil, purchasedFrom: nil,
            idProvider: nil, lastWeight: nil, hasHorn: nil,
            estimatedWeight: nil, createdAt: nil, updatedAt: nil,
            weightHistory: nil, medicationHistory: nil
        )
        super.init()
    }
}

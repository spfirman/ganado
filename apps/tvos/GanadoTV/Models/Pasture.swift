import Foundation

enum PastureStatus: String, Codable, CaseIterable {
    case RESTING, ACTIVE, OVER_GRAZED

    var label: String {
        switch self {
        case .RESTING: return "Resting"
        case .ACTIVE: return "Active"
        case .OVER_GRAZED: return "Over-Grazed"
        }
    }
}

struct Pasture: Codable, Identifiable, Hashable {
    let id: String
    let idTenant: String?
    let name: String?
    let areaHectares: Double?
    let grassType: String?
    let status: PastureStatus?
    let capacity: Int?
    let currentCount: Int?
    let lastRotationDate: String?
    let nextRotationDate: String?
    let notes: String?
    let createdAt: String?
    let updatedAt: String?

    var displayName: String { name ?? "Unnamed Pasture" }

    var utilizationPercentage: Double {
        guard let capacity = capacity, capacity > 0, let current = currentCount else { return 0 }
        return Double(current) / Double(capacity) * 100
    }

    var isAtCapacity: Bool {
        guard let capacity = capacity, let current = currentCount else { return false }
        return current >= capacity
    }
}

struct GrazingRotation: Codable, Identifiable, Hashable {
    let id: String
    let pastureId: String?
    let pastureName: String?
    let startDate: String?
    let endDate: String?
    let cattleCount: Int?
    let notes: String?
    let createdAt: String?
}

struct PastureListResponse: Codable {
    let items: [Pasture]
    let total: Int?
    let hasMore: Bool?
}

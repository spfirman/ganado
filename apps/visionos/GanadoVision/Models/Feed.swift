import Foundation

enum FeedCategory: String, Codable, CaseIterable {
    case HAY, GRAIN, SUPPLEMENT, MINERAL, SILAGE

    var label: String { rawValue.capitalized }

    var icon: String {
        switch self {
        case .HAY: return "leaf.fill"
        case .GRAIN: return "circle.grid.3x3.fill"
        case .SUPPLEMENT: return "pills.fill"
        case .MINERAL: return "diamond.fill"
        case .SILAGE: return "cylinder.fill"
        }
    }
}

enum FeedingTargetGroup: String, Codable, CaseIterable {
    case ALL, LOT, INDIVIDUAL

    var label: String { rawValue.capitalized }
}

struct FeedType: Codable, Identifiable, Hashable {
    let id: String
    let idTenant: String?
    let name: String?
    let category: FeedCategory?
    let unit: String?
    let pricePerUnit: Double?
    let nutritionalInfo: String?
    let inStock: Double?
    let createdAt: String?
    let updatedAt: String?

    var displayName: String { name ?? "Unknown Feed" }
    var isLowStock: Bool { (inStock ?? 0) < 10 && (inStock ?? 0) > 0 }
    var isOutOfStock: Bool { (inStock ?? 0) <= 0 }
}

struct FeedingRecord: Codable, Identifiable, Hashable {
    let id: String
    let idTenant: String?
    let feedTypeId: String?
    let feedTypeName: String?
    let quantity: Double?
    let unit: String?
    let targetGroup: FeedingTargetGroup?
    let targetId: String?
    let fedAt: String?
    let fedBy: String?
    let cost: Double?
    let notes: String?
    let createdAt: String?
}

struct FeedingSummary: Codable {
    let totalQuantity: Double?
    let totalCost: Double?
    let recordsCount: Int?
    let dateRange: String?
}

struct FeedTypeListResponse: Codable {
    let items: [FeedType]
    let total: Int?
    let hasMore: Bool?
}

struct FeedingRecordListResponse: Codable {
    let items: [FeedingRecord]
    let total: Int?
    let hasMore: Bool?
}

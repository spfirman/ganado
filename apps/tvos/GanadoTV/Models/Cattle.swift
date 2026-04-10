import Foundation

enum CattleStatus: String, Codable, CaseIterable {
    case active, sold, dead, transferred
}

enum CattleGender: String, Codable, CaseIterable {
    case male, female
}

enum CattleColor: String, Codable, CaseIterable {
    case black, white, brown, red, spotted, gray, yellow, brindle
}

struct Cattle: Codable, Identifiable, Hashable {
    let id: String
    let idTenant: String?
    let sysNumber: Int?
    let number: String?
    let receivedAt: String?
    let receivedWeight: Double?
    let idPurchase: String?
    let purchaseWeight: Double?
    let purchasePrice: Double?
    let idLot: String?
    let idBrand: String?
    let color: CattleColor?
    let eartagLeft: String?
    let eartagRight: String?
    let idDevice: String?
    let castrated: Bool?
    let castrationDate: String?
    let comments: String?
    let status: CattleStatus?
    let gender: CattleGender?
    let birthDateAprx: String?
    let newFeedStartDate: String?
    let purchaseCommission: Double?
    let negotiatedPricePerKg: Double?
    let lotPricePerWeight: Double?
    let salePrice: Double?
    let salePricePerKg: Double?
    let saleWeight: Double?
    let averageGr: Double?
    let averageDailyGain: Double?
    let purchasedFrom: String?
    let idProvider: String?
    let lastWeight: Double?
    let hasHorn: Bool?
    let estimatedWeight: Double?
    let createdAt: String?
    let updatedAt: String?
    let weightHistory: [CattleWeightHistory]?
    let medicationHistory: [CattleMedicationHistory]?

    var displayNumber: String {
        number ?? sysNumber.map(String.init) ?? "N/A"
    }

    var statusColor: String {
        switch status {
        case .active: return "green"
        case .sold: return "blue"
        case .dead: return "red"
        case .transferred: return "orange"
        case nil: return "gray"
        }
    }

    var displayWeight: String {
        if let w = lastWeight ?? estimatedWeight {
            return String(format: "%.0f kg", w)
        }
        return "-- kg"
    }

    var displayBreed: String {
        color?.rawValue.capitalized ?? "Unknown"
    }
}

struct CattleWeightHistory: Codable, Identifiable, Hashable {
    let id: String
    let idCattle: String?
    let weight: Double
    let weighedAt: String?
    let registeredBy: String?
}

struct CattleMedicationHistory: Codable, Identifiable, Hashable {
    let id: String
    let idCattle: String?
    let medication: String?
    let dosage: String?
    let notes: String?
    let appliedAt: String?
    let appliedBy: String?
}

struct CattleListResponse: Codable {
    let items: [Cattle]
    let total: Int?
    let page: Int?
    let limit: Int?
    let hasMore: Bool?
}

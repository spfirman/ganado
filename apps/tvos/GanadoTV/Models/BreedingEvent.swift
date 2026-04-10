import Foundation

enum BreedingEventType: String, Codable, CaseIterable {
    case HEAT_DETECTION, INSEMINATION, NATURAL_BREEDING, PREGNANCY_CHECK, CALVING, WEANING, ABORTION

    var label: String {
        switch self {
        case .HEAT_DETECTION: return "Heat Detection"
        case .INSEMINATION: return "Insemination"
        case .NATURAL_BREEDING: return "Natural Breeding"
        case .PREGNANCY_CHECK: return "Pregnancy Check"
        case .CALVING: return "Calving"
        case .WEANING: return "Weaning"
        case .ABORTION: return "Abortion"
        }
    }

    var icon: String {
        switch self {
        case .HEAT_DETECTION: return "flame.fill"
        case .INSEMINATION: return "syringe"
        case .NATURAL_BREEDING: return "heart.fill"
        case .PREGNANCY_CHECK: return "magnifyingglass"
        case .CALVING: return "star.fill"
        case .WEANING: return "arrow.right.circle.fill"
        case .ABORTION: return "xmark.circle.fill"
        }
    }
}

enum PregnancyStatus: String, Codable, CaseIterable {
    case OPEN, BRED, CONFIRMED, LATE, CALVED, ABORTED

    var label: String {
        switch self {
        case .OPEN: return "Open"
        case .BRED: return "Bred"
        case .CONFIRMED: return "Confirmed"
        case .LATE: return "Late"
        case .CALVED: return "Calved"
        case .ABORTED: return "Aborted"
        }
    }
}

struct BreedingEvent: Codable, Identifiable, Hashable {
    let id: String
    let idTenant: String?
    let idCattle: String?
    let cattleNumber: String?
    let sireId: String?
    let sireNumber: String?
    let type: BreedingEventType?
    let pregnancyStatus: PregnancyStatus?
    let eventDate: String?
    let expectedCalvingDate: String?
    let actualCalvingDate: String?
    let calvingDifficulty: String?
    let calvesCount: Int?
    let calfId: String?
    let calfBirthWeight: Double?
    let calfGender: String?
    let inseminationType: String?
    let semenBatch: String?
    let technician: String?
    let notes: String?
    let createdAt: String?
    let updatedAt: String?
}

struct BreedingEventListResponse: Codable {
    let items: [BreedingEvent]
    let total: Int?
    let hasMore: Bool?
}

import Foundation

enum HealthEventType: String, Codable, CaseIterable {
    case VACCINATION, DEWORMING, TREATMENT, INJURY, DISEASE, CHECKUP, SURGERY, OTHER

    var label: String {
        switch self {
        case .VACCINATION: return "Vaccination"
        case .DEWORMING: return "Deworming"
        case .TREATMENT: return "Treatment"
        case .INJURY: return "Injury"
        case .DISEASE: return "Disease"
        case .CHECKUP: return "Checkup"
        case .SURGERY: return "Surgery"
        case .OTHER: return "Other"
        }
    }

    var icon: String {
        switch self {
        case .VACCINATION: return "syringe.fill"
        case .DEWORMING: return "pills.fill"
        case .TREATMENT: return "cross.case.fill"
        case .INJURY: return "bandage.fill"
        case .DISEASE: return "allergens.fill"
        case .CHECKUP: return "stethoscope"
        case .SURGERY: return "scissors"
        case .OTHER: return "ellipsis.circle.fill"
        }
    }
}

struct HealthEvent: Codable, Identifiable, Hashable {
    let id: String
    let idTenant: String?
    let idCattle: String?
    let cattleNumber: String?
    let type: HealthEventType?
    let name: String?
    let description: String?
    let medication: String?
    let dosage: String?
    let diagnosis: String?
    let veterinarian: String?
    let cost: Double?
    let status: String?
    let eventDate: String?
    let followUpDate: String?
    let notes: String?
    let createdAt: String?
    let updatedAt: String?

    var displayName: String {
        name ?? type?.label ?? "Health Event"
    }
}

struct HealthEventListResponse: Codable {
    let items: [HealthEvent]
    let total: Int?
    let hasMore: Bool?
}

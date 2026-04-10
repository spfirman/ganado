import Foundation

enum WorkOrderType: String, Codable, CaseIterable {
    case FENCING, MAINTENANCE, VETERINARY, FEEDING, GENERAL

    var label: String {
        switch self {
        case .FENCING: return "Fencing"
        case .MAINTENANCE: return "Maintenance"
        case .VETERINARY: return "Veterinary"
        case .FEEDING: return "Feeding"
        case .GENERAL: return "General"
        }
    }

    var icon: String {
        switch self {
        case .FENCING: return "square.grid.3x3"
        case .MAINTENANCE: return "wrench.fill"
        case .VETERINARY: return "cross.case.fill"
        case .FEEDING: return "leaf.fill"
        case .GENERAL: return "list.bullet"
        }
    }
}

enum WorkOrderPriority: String, Codable, CaseIterable {
    case LOW, MEDIUM, HIGH, URGENT

    var label: String { rawValue.capitalized }
}

enum WorkOrderStatus: String, Codable, CaseIterable {
    case PENDING, IN_PROGRESS, COMPLETED, CANCELLED

    var label: String {
        switch self {
        case .PENDING: return "Pending"
        case .IN_PROGRESS: return "In Progress"
        case .COMPLETED: return "Completed"
        case .CANCELLED: return "Cancelled"
        }
    }
}

struct WorkOrder: Codable, Identifiable, Hashable {
    let id: String
    let idTenant: String?
    let title: String?
    let description: String?
    let type: WorkOrderType?
    let priority: WorkOrderPriority?
    let status: WorkOrderStatus?
    let assignedTo: String?
    let assignedToName: String?
    let dueDate: String?
    let completedAt: String?
    let notes: String?
    let createdAt: String?
    let updatedAt: String?

    var displayTitle: String {
        title ?? "Untitled Task"
    }
}

struct WorkOrderListResponse: Codable {
    let items: [WorkOrder]
    let total: Int?
    let hasMore: Bool?
}

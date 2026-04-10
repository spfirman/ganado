import Foundation

struct MassiveEvent: Codable, Identifiable, Hashable {
    let id: String
    let name: String?
    let description: String?
    let status: String?
    let createdAt: String?
    let closedAt: String?
    let createdBy: String?

    var isOpen: Bool { status == "open" }
    var displayName: String { name ?? "Unnamed Event" }
}

struct SimpleEvent: Codable, Identifiable, Hashable {
    let id: String
    let idMassiveEvent: String?
    let name: String?
    let type: String?
    let dataJson: String?
    let createdAt: String?
}

struct MassiveEventListResponse: Codable {
    let items: [MassiveEvent]
    let total: Int?
    let hasMore: Bool?
}

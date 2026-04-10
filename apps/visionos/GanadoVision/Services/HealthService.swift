import Foundation

@MainActor
class HealthService: ObservableObject {
    private let api = APIClient.shared

    func listHealthEvents(page: Int = 1, limit: Int = 20, cattleId: String? = nil, type: HealthEventType? = nil) async throws -> HealthEventListResponse {
        var query: [URLQueryItem] = [
            URLQueryItem(name: "page", value: "\(page)"),
            URLQueryItem(name: "limit", value: "\(limit)")
        ]
        if let cattleId {
            query.append(URLQueryItem(name: "cattle_id", value: cattleId))
        }
        if let type {
            query.append(URLQueryItem(name: "type", value: type.rawValue))
        }
        return try await api.get(path: "/health-events", queryItems: query)
    }

    func getHealthEvent(id: String) async throws -> HealthEvent {
        try await api.get(path: "/health-events/\(id)")
    }

    func getCattleHealthEvents(cattleId: String) async throws -> [HealthEvent] {
        try await api.get(path: "/cattle/\(cattleId)/health-events")
    }

    func createHealthEvent(_ event: CreateHealthEventRequest) async throws -> HealthEvent {
        try await api.post(path: "/health-events", body: event)
    }

    func updateHealthEvent(id: String, _ event: CreateHealthEventRequest) async throws -> HealthEvent {
        try await api.patch(path: "/health-events/\(id)", body: event)
    }

    func deleteHealthEvent(id: String) async throws {
        try await api.delete(path: "/health-events/\(id)")
    }
}

struct CreateHealthEventRequest: Encodable {
    let idCattle: String
    let type: String
    let name: String
    let description: String?
    let medication: String?
    let dosage: String?
    let diagnosis: String?
    let veterinarian: String?
    let cost: Double?
    let eventDate: String
    let followUpDate: String?
    let notes: String?
}

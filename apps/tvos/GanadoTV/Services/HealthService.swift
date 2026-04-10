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
}

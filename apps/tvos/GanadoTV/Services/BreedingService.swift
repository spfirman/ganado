import Foundation

@MainActor
class BreedingService: ObservableObject {
    private let api = APIClient.shared

    func listBreedingEvents(page: Int = 1, limit: Int = 20, cattleId: String? = nil, type: BreedingEventType? = nil) async throws -> BreedingEventListResponse {
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
        return try await api.get(path: "/breeding-events", queryItems: query)
    }

    func getBreedingEvent(id: String) async throws -> BreedingEvent {
        try await api.get(path: "/breeding-events/\(id)")
    }

    func getCattleBreedingHistory(cattleId: String) async throws -> [BreedingEvent] {
        try await api.get(path: "/cattle/\(cattleId)/breeding-history")
    }
}

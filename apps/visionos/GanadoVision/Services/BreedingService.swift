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

    func createBreedingEvent(_ event: CreateBreedingEventRequest) async throws -> BreedingEvent {
        try await api.post(path: "/breeding-events", body: event)
    }

    func updateBreedingEvent(id: String, _ event: CreateBreedingEventRequest) async throws -> BreedingEvent {
        try await api.patch(path: "/breeding-events/\(id)", body: event)
    }

    func deleteBreedingEvent(id: String) async throws {
        try await api.delete(path: "/breeding-events/\(id)")
    }
}

struct CreateBreedingEventRequest: Encodable {
    let idCattle: String
    let sireId: String?
    let sireNumber: String?
    let type: String
    let pregnancyStatus: String?
    let eventDate: String
    let expectedCalvingDate: String?
    let notes: String?
}

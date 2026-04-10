import Foundation

@MainActor
class PastureService: ObservableObject {
    private let api = APIClient.shared

    func listPastures(page: Int = 1, limit: Int = 20, status: PastureStatus? = nil) async throws -> PastureListResponse {
        var query: [URLQueryItem] = [
            URLQueryItem(name: "page", value: "\(page)"),
            URLQueryItem(name: "limit", value: "\(limit)")
        ]
        if let status {
            query.append(URLQueryItem(name: "status", value: status.rawValue))
        }
        return try await api.get(path: "/pastures", queryItems: query)
    }

    func getPasture(id: String) async throws -> Pasture {
        try await api.get(path: "/pastures/\(id)")
    }

    func getRotations(pastureId: String) async throws -> [GrazingRotation] {
        try await api.get(path: "/pastures/\(pastureId)/rotations")
    }
}

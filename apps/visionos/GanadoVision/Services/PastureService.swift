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

    func createPasture(_ pasture: CreatePastureRequest) async throws -> Pasture {
        try await api.post(path: "/pastures", body: pasture)
    }

    func updatePasture(id: String, _ pasture: CreatePastureRequest) async throws -> Pasture {
        try await api.patch(path: "/pastures/\(id)", body: pasture)
    }

    func deletePasture(id: String) async throws {
        try await api.delete(path: "/pastures/\(id)")
    }

    func getRotations(pastureId: String) async throws -> [GrazingRotation] {
        try await api.get(path: "/pastures/\(pastureId)/rotations")
    }

    func createRotation(_ rotation: CreateRotationRequest) async throws -> GrazingRotation {
        try await api.post(path: "/grazing-rotations", body: rotation)
    }
}

struct CreatePastureRequest: Encodable {
    let name: String
    let areaHectares: Double?
    let grassType: String?
    let status: String?
    let capacity: Int?
    let notes: String?
}

struct CreateRotationRequest: Encodable {
    let pastureId: String
    let startDate: String
    let endDate: String?
    let cattleCount: Int
    let notes: String?
}

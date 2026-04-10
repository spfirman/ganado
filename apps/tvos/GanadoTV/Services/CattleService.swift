import Foundation

@MainActor
class CattleService: ObservableObject {
    private let api = APIClient.shared

    func listCattle(page: Int = 1, limit: Int = 20, search: String? = nil, status: CattleStatus? = nil, gender: CattleGender? = nil) async throws -> CattleListResponse {
        var query: [URLQueryItem] = [
            URLQueryItem(name: "page", value: "\(page)"),
            URLQueryItem(name: "limit", value: "\(limit)")
        ]
        if let search, !search.isEmpty {
            query.append(URLQueryItem(name: "search", value: search))
        }
        if let status {
            query.append(URLQueryItem(name: "status", value: status.rawValue))
        }
        if let gender {
            query.append(URLQueryItem(name: "gender", value: gender.rawValue))
        }
        return try await api.get(path: "/cattle", queryItems: query)
    }

    func getCattle(id: String) async throws -> Cattle {
        try await api.get(path: "/cattle/\(id)")
    }

    func deleteCattle(id: String) async throws {
        try await api.delete(path: "/cattle/\(id)")
    }

    func recordWeight(cattleId: String, weight: Double) async throws -> CattleWeightHistory {
        struct WeightBody: Encodable { let weight: Double }
        return try await api.post(path: "/cattle/\(cattleId)/weight", body: WeightBody(weight: weight))
    }
}

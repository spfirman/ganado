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

    func createCattle(_ cattle: [String: Any]) async throws -> Cattle {
        let data = try JSONSerialization.data(withJSONObject: cattle)
        let encodable = JSONData(data: data)
        return try await api.post(path: "/cattle", body: encodable)
    }

    func updateCattle(id: String, _ updates: [String: Any]) async throws -> Cattle {
        let data = try JSONSerialization.data(withJSONObject: updates)
        let encodable = JSONData(data: data)
        return try await api.patch(path: "/cattle/\(id)", body: encodable)
    }

    func deleteCattle(id: String) async throws {
        try await api.delete(path: "/cattle/\(id)")
    }

    func recordWeight(cattleId: String, weight: Double) async throws -> CattleWeightHistory {
        struct WeightBody: Encodable { let weight: Double }
        return try await api.post(path: "/cattle/\(cattleId)/weight", body: WeightBody(weight: weight))
    }

    func addMedication(cattleId: String, medication: String, dosage: String, notes: String?) async throws -> CattleMedicationHistory {
        struct MedBody: Encodable { let medication: String; let dosage: String; let notes: String? }
        return try await api.post(path: "/cattle/\(cattleId)/medications", body: MedBody(medication: medication, dosage: dosage, notes: notes))
    }
}

struct JSONData: Encodable {
    let data: Data

    func encode(to encoder: Encoder) throws {
        var container = encoder.singleValueContainer()
        let json = try JSONSerialization.jsonObject(with: data)
        if let dict = json as? [String: Any] {
            try container.encode(dict.mapValues { AnyCodable($0) })
        }
    }
}

struct AnyCodable: Encodable {
    let value: Any

    init(_ value: Any) { self.value = value }

    func encode(to encoder: Encoder) throws {
        var container = encoder.singleValueContainer()
        switch value {
        case let v as String: try container.encode(v)
        case let v as Int: try container.encode(v)
        case let v as Double: try container.encode(v)
        case let v as Bool: try container.encode(v)
        case is NSNull: try container.encodeNil()
        default: try container.encode(String(describing: value))
        }
    }
}

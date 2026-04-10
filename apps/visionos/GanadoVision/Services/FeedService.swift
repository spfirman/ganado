import Foundation

@MainActor
class FeedService: ObservableObject {
    private let api = APIClient.shared

    func listFeedTypes(page: Int = 1, limit: Int = 20, category: FeedCategory? = nil) async throws -> FeedTypeListResponse {
        var query: [URLQueryItem] = [
            URLQueryItem(name: "page", value: "\(page)"),
            URLQueryItem(name: "limit", value: "\(limit)")
        ]
        if let category {
            query.append(URLQueryItem(name: "category", value: category.rawValue))
        }
        return try await api.get(path: "/feed-types", queryItems: query)
    }

    func getFeedType(id: String) async throws -> FeedType {
        try await api.get(path: "/feed-types/\(id)")
    }

    func createFeedType(_ feed: CreateFeedTypeRequest) async throws -> FeedType {
        try await api.post(path: "/feed-types", body: feed)
    }

    func updateFeedType(id: String, _ feed: CreateFeedTypeRequest) async throws -> FeedType {
        try await api.patch(path: "/feed-types/\(id)", body: feed)
    }

    func deleteFeedType(id: String) async throws {
        try await api.delete(path: "/feed-types/\(id)")
    }

    func listFeedingRecords(page: Int = 1, limit: Int = 20) async throws -> FeedingRecordListResponse {
        let query: [URLQueryItem] = [
            URLQueryItem(name: "page", value: "\(page)"),
            URLQueryItem(name: "limit", value: "\(limit)")
        ]
        return try await api.get(path: "/feeding-records", queryItems: query)
    }

    func createFeedingRecord(_ record: CreateFeedingRecordRequest) async throws -> FeedingRecord {
        try await api.post(path: "/feeding-records", body: record)
    }

    func getFeedingSummary(fromDate: String? = nil, toDate: String? = nil) async throws -> FeedingSummary {
        var query: [URLQueryItem] = []
        if let fromDate { query.append(URLQueryItem(name: "from_date", value: fromDate)) }
        if let toDate { query.append(URLQueryItem(name: "to_date", value: toDate)) }
        return try await api.get(path: "/feeding-records/summary", queryItems: query.isEmpty ? nil : query)
    }
}

struct CreateFeedTypeRequest: Encodable {
    let name: String
    let category: String
    let unit: String?
    let pricePerUnit: Double?
    let nutritionalInfo: String?
    let inStock: Double?
}

struct CreateFeedingRecordRequest: Encodable {
    let feedTypeId: String
    let quantity: Double
    let unit: String?
    let targetGroup: String
    let targetId: String?
    let fedBy: String?
    let notes: String?
}

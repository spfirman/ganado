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

    func listFeedingRecords(page: Int = 1, limit: Int = 20) async throws -> FeedingRecordListResponse {
        let query: [URLQueryItem] = [
            URLQueryItem(name: "page", value: "\(page)"),
            URLQueryItem(name: "limit", value: "\(limit)")
        ]
        return try await api.get(path: "/feeding-records", queryItems: query)
    }

    func getFeedingSummary(fromDate: String? = nil, toDate: String? = nil) async throws -> FeedingSummary {
        var query: [URLQueryItem] = []
        if let fromDate { query.append(URLQueryItem(name: "from_date", value: fromDate)) }
        if let toDate { query.append(URLQueryItem(name: "to_date", value: toDate)) }
        return try await api.get(path: "/feeding-records/summary", queryItems: query.isEmpty ? nil : query)
    }
}

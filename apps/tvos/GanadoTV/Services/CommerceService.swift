import Foundation

@MainActor
class CommerceService: ObservableObject {
    private let api = APIClient.shared

    func listPurchases(page: Int = 1, limit: Int = 20) async throws -> PurchaseListResponse {
        let query: [URLQueryItem] = [
            URLQueryItem(name: "page", value: "\(page)"),
            URLQueryItem(name: "limit", value: "\(limit)")
        ]
        return try await api.get(path: "/purchases", queryItems: query)
    }

    func listSales(page: Int = 1, limit: Int = 20) async throws -> SaleListResponse {
        let query: [URLQueryItem] = [
            URLQueryItem(name: "page", value: "\(page)"),
            URLQueryItem(name: "limit", value: "\(limit)")
        ]
        return try await api.get(path: "/sales", queryItems: query)
    }

    func listWorkOrders(page: Int = 1, limit: Int = 20, status: WorkOrderStatus? = nil) async throws -> WorkOrderListResponse {
        var query: [URLQueryItem] = [
            URLQueryItem(name: "page", value: "\(page)"),
            URLQueryItem(name: "limit", value: "\(limit)")
        ]
        if let status {
            query.append(URLQueryItem(name: "status", value: status.rawValue))
        }
        return try await api.get(path: "/work-orders", queryItems: query)
    }
}

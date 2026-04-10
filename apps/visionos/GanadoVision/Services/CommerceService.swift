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

    func getPurchase(id: String) async throws -> Purchase {
        try await api.get(path: "/purchases/\(id)")
    }

    func listSales(page: Int = 1, limit: Int = 20) async throws -> SaleListResponse {
        let query: [URLQueryItem] = [
            URLQueryItem(name: "page", value: "\(page)"),
            URLQueryItem(name: "limit", value: "\(limit)")
        ]
        return try await api.get(path: "/sales", queryItems: query)
    }

    func getSale(id: String) async throws -> Sale {
        try await api.get(path: "/sales/\(id)")
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

    func getWorkOrder(id: String) async throws -> WorkOrder {
        try await api.get(path: "/work-orders/\(id)")
    }

    func createWorkOrder(_ order: CreateWorkOrderRequest) async throws -> WorkOrder {
        try await api.post(path: "/work-orders", body: order)
    }

    func updateWorkOrder(id: String, _ order: CreateWorkOrderRequest) async throws -> WorkOrder {
        try await api.patch(path: "/work-orders/\(id)", body: order)
    }

    func deleteWorkOrder(id: String) async throws {
        try await api.delete(path: "/work-orders/\(id)")
    }

    func listMassiveEvents(page: Int = 1, limit: Int = 20) async throws -> MassiveEventListResponse {
        let query: [URLQueryItem] = [
            URLQueryItem(name: "page", value: "\(page)"),
            URLQueryItem(name: "limit", value: "\(limit)")
        ]
        return try await api.get(path: "/massive-events", queryItems: query)
    }

    func getMassiveEvent(id: String) async throws -> MassiveEvent {
        try await api.get(path: "/massive-events/\(id)")
    }

    func getSimpleEvents(massiveEventId: String) async throws -> [SimpleEvent] {
        let query = [URLQueryItem(name: "id_massive_event", value: massiveEventId)]
        return try await api.get(path: "/simple-events", queryItems: query)
    }
}

struct CreateWorkOrderRequest: Encodable {
    let title: String
    let description: String?
    let type: String
    let priority: String
    let assignedTo: String?
    let dueDate: String?
    let notes: String?
}

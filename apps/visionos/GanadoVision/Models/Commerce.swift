import Foundation

struct Purchase: Codable, Identifiable, Hashable {
    let id: String
    let idTenant: String?
    let idProvider: String?
    let providerName: String?
    let status: String?
    let totalWeight: Double?
    let totalPrice: Double?
    let totalAnimals: Int?
    let purchaseDate: String?
    let comments: String?
    let createdAt: String?
    let updatedAt: String?
}

struct Sale: Codable, Identifiable, Hashable {
    let id: String
    let buyerName: String?
    let buyerNit: String?
    let status: String?
    let totalWeight: Double?
    let totalPrice: Double?
    let totalAnimals: Int?
    let saleDate: String?
    let comments: String?
    let createdAt: String?
}

struct Vendor: Codable, Identifiable, Hashable {
    let id: String
    let name: String?
    let nit: String?
    let type: String?
    let phone: String?
    let email: String?
    let address: String?
    let createdAt: String?
}

struct PurchaseListResponse: Codable {
    let items: [Purchase]
    let total: Int?
    let hasMore: Bool?
}

struct SaleListResponse: Codable {
    let items: [Sale]
    let total: Int?
    let hasMore: Bool?
}

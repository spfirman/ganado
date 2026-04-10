import Foundation
import SwiftUI

@MainActor
class MarketViewModel: ObservableObject {
    @Published var purchases: [Purchase] = []
    @Published var sales: [Sale] = []
    @Published var isLoading = false
    @Published var errorMessage: String?

    private let service = CommerceService()

    func loadMarketData() async {
        isLoading = true
        errorMessage = nil

        do {
            async let purchaseResponse = service.listPurchases(limit: 50)
            async let saleResponse = service.listSales(limit: 50)

            let (purchaseResult, saleResult) = try await (purchaseResponse, saleResponse)
            purchases = purchaseResult.items
            sales = saleResult.items
        } catch {
            errorMessage = error.localizedDescription
        }

        isLoading = false
    }

    var totalPurchaseValue: Double {
        purchases.compactMap(\.totalPrice).reduce(0, +)
    }

    var totalSaleValue: Double {
        sales.compactMap(\.totalPrice).reduce(0, +)
    }

    var totalAnimalsPurchased: Int {
        purchases.compactMap(\.totalAnimals).reduce(0, +)
    }

    var totalAnimalsSold: Int {
        sales.compactMap(\.totalAnimals).reduce(0, +)
    }
}

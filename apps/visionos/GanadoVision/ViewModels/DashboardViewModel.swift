import Foundation
import SwiftUI

struct HerdSummary {
    var totalCattle: Int = 0
    var activeCattle: Int = 0
    var bulls: Int = 0
    var cows: Int = 0
    var calves: Int = 0
    var soldThisMonth: Int = 0
    var recentEvents: [HealthEvent] = []
    var activePastures: Int = 0
    var totalPastures: Int = 0
    var pendingWorkOrders: Int = 0
    var upcomingBreedings: [BreedingEvent] = []
}

@MainActor
class DashboardViewModel: ObservableObject {
    @Published var summary = HerdSummary()
    @Published var cattle: [Cattle] = []
    @Published var isLoading = false
    @Published var errorMessage: String?

    private let cattleService = CattleService()
    private let healthService = HealthService()
    private let pastureService = PastureService()
    private let breedingService = BreedingService()
    private let commerceService = CommerceService()

    func loadDashboard() async {
        isLoading = true
        errorMessage = nil

        do {
            async let cattleResponse = cattleService.listCattle(limit: 100)
            async let healthResponse = healthService.listHealthEvents(limit: 10)
            async let pastureResponse = pastureService.listPastures(limit: 50)
            async let breedingResponse = breedingService.listBreedingEvents(limit: 10)
            async let workOrderResponse = commerceService.listWorkOrders(limit: 50, status: .PENDING)

            let (cattleResult, healthResult, pastureResult, breedingResult, workOrderResult) =
                try await (cattleResponse, healthResponse, pastureResponse, breedingResponse, workOrderResponse)

            cattle = cattleResult.items

            var s = HerdSummary()
            s.totalCattle = cattleResult.items.count
            s.activeCattle = cattleResult.items.filter { $0.status == .active }.count
            s.bulls = cattleResult.items.filter { $0.gender == .male }.count
            s.cows = cattleResult.items.filter { $0.gender == .female }.count
            s.recentEvents = healthResult.items
            s.totalPastures = pastureResult.items.count
            s.activePastures = pastureResult.items.filter { $0.status == .ACTIVE }.count
            s.pendingWorkOrders = workOrderResult.items.count
            s.upcomingBreedings = breedingResult.items
            summary = s
        } catch {
            errorMessage = error.localizedDescription
        }

        isLoading = false
    }
}

import Foundation

@MainActor
class CommerceViewModel: ObservableObject {
    @Published var purchases: [Purchase] = []
    @Published var sales: [Sale] = []
    @Published var workOrders: [WorkOrder] = []
    @Published var massiveEvents: [MassiveEvent] = []
    @Published var isLoading = false
    @Published var errorMessage: String?

    private let service = CommerceService()

    func loadPurchases() async {
        isLoading = true
        do {
            let response = try await service.listPurchases()
            purchases = response.items
        } catch {
            errorMessage = error.localizedDescription
        }
        isLoading = false
    }

    func loadSales() async {
        isLoading = true
        do {
            let response = try await service.listSales()
            sales = response.items
        } catch {
            errorMessage = error.localizedDescription
        }
        isLoading = false
    }

    func loadWorkOrders(status: WorkOrderStatus? = nil) async {
        isLoading = true
        do {
            let response = try await service.listWorkOrders(status: status)
            workOrders = response.items
        } catch {
            errorMessage = error.localizedDescription
        }
        isLoading = false
    }

    func loadMassiveEvents() async {
        isLoading = true
        do {
            let response = try await service.listMassiveEvents()
            massiveEvents = response.items
        } catch {
            errorMessage = error.localizedDescription
        }
        isLoading = false
    }

    func deleteWorkOrder(id: String) async {
        do {
            try await service.deleteWorkOrder(id: id)
            workOrders.removeAll { $0.id == id }
        } catch {
            errorMessage = error.localizedDescription
        }
    }
}

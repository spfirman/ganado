import Foundation

@MainActor
class HealthViewModel: ObservableObject {
    @Published var events: [HealthEvent] = []
    @Published var isLoading = false
    @Published var errorMessage: String?
    @Published var filterType: HealthEventType?
    @Published var currentPage = 1
    @Published var hasMore = true

    private let service = HealthService()

    func loadEvents(reset: Bool = false) async {
        if reset {
            currentPage = 1
            events = []
            hasMore = true
        }
        guard hasMore else { return }
        isLoading = true

        do {
            let response = try await service.listHealthEvents(page: currentPage, type: filterType)
            if reset {
                events = response.items
            } else {
                events.append(contentsOf: response.items)
            }
            hasMore = response.hasMore ?? (response.items.count >= 20)
            currentPage += 1
        } catch {
            errorMessage = error.localizedDescription
        }
        isLoading = false
    }

    func deleteEvent(id: String) async {
        do {
            try await service.deleteHealthEvent(id: id)
            events.removeAll { $0.id == id }
        } catch {
            errorMessage = error.localizedDescription
        }
    }
}

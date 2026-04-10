import Foundation

@MainActor
class BreedingViewModel: ObservableObject {
    @Published var events: [BreedingEvent] = []
    @Published var isLoading = false
    @Published var errorMessage: String?
    @Published var filterType: BreedingEventType?
    @Published var currentPage = 1
    @Published var hasMore = true

    private let service = BreedingService()

    func loadEvents(reset: Bool = false) async {
        if reset {
            currentPage = 1
            events = []
            hasMore = true
        }
        guard hasMore else { return }
        isLoading = true

        do {
            let response = try await service.listBreedingEvents(page: currentPage, type: filterType)
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
            try await service.deleteBreedingEvent(id: id)
            events.removeAll { $0.id == id }
        } catch {
            errorMessage = error.localizedDescription
        }
    }
}

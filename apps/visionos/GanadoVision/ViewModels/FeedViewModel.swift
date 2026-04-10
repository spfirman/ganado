import Foundation

@MainActor
class FeedViewModel: ObservableObject {
    @Published var feedTypes: [FeedType] = []
    @Published var feedingRecords: [FeedingRecord] = []
    @Published var summary: FeedingSummary?
    @Published var isLoading = false
    @Published var errorMessage: String?
    @Published var filterCategory: FeedCategory?
    @Published var currentPage = 1
    @Published var hasMore = true

    private let service = FeedService()

    func loadFeedTypes(reset: Bool = false) async {
        if reset {
            currentPage = 1
            feedTypes = []
            hasMore = true
        }
        guard hasMore else { return }
        isLoading = true

        do {
            let response = try await service.listFeedTypes(page: currentPage, category: filterCategory)
            if reset {
                feedTypes = response.items
            } else {
                feedTypes.append(contentsOf: response.items)
            }
            hasMore = response.hasMore ?? (response.items.count >= 20)
            currentPage += 1
        } catch {
            errorMessage = error.localizedDescription
        }
        isLoading = false
    }

    func loadFeedingRecords() async {
        do {
            let response = try await service.listFeedingRecords()
            feedingRecords = response.items
        } catch {
            errorMessage = error.localizedDescription
        }
    }

    func loadSummary() async {
        do {
            summary = try await service.getFeedingSummary()
        } catch {
            errorMessage = error.localizedDescription
        }
    }

    func deleteFeedType(id: String) async {
        do {
            try await service.deleteFeedType(id: id)
            feedTypes.removeAll { $0.id == id }
        } catch {
            errorMessage = error.localizedDescription
        }
    }
}

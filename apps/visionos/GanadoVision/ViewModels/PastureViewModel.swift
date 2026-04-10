import Foundation

@MainActor
class PastureViewModel: ObservableObject {
    @Published var pastures: [Pasture] = []
    @Published var selectedPasture: Pasture?
    @Published var rotations: [GrazingRotation] = []
    @Published var isLoading = false
    @Published var errorMessage: String?
    @Published var filterStatus: PastureStatus?
    @Published var currentPage = 1
    @Published var hasMore = true

    private let service = PastureService()

    func loadPastures(reset: Bool = false) async {
        if reset {
            currentPage = 1
            pastures = []
            hasMore = true
        }
        guard hasMore else { return }
        isLoading = true

        do {
            let response = try await service.listPastures(page: currentPage, status: filterStatus)
            if reset {
                pastures = response.items
            } else {
                pastures.append(contentsOf: response.items)
            }
            hasMore = response.hasMore ?? (response.items.count >= 20)
            currentPage += 1
        } catch {
            errorMessage = error.localizedDescription
        }
        isLoading = false
    }

    func loadRotations(pastureId: String) async {
        do {
            rotations = try await service.getRotations(pastureId: pastureId)
        } catch {
            errorMessage = error.localizedDescription
        }
    }

    func deletePasture(id: String) async {
        do {
            try await service.deletePasture(id: id)
            pastures.removeAll { $0.id == id }
        } catch {
            errorMessage = error.localizedDescription
        }
    }
}

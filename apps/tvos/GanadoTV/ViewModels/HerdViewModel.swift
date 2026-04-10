import Foundation
import SwiftUI

@MainActor
class HerdViewModel: ObservableObject {
    @Published var cattle: [Cattle] = []
    @Published var selectedCattle: Cattle?
    @Published var isLoading = false
    @Published var errorMessage: String?
    @Published var searchText = ""
    @Published var filterStatus: CattleStatus?
    @Published var filterGender: CattleGender?
    @Published var currentPage = 1
    @Published var hasMore = true

    private let service = CattleService()

    func loadCattle(reset: Bool = false) async {
        if reset {
            currentPage = 1
            cattle = []
            hasMore = true
        }

        guard hasMore else { return }
        isLoading = true
        errorMessage = nil

        do {
            let response = try await service.listCattle(
                page: currentPage,
                search: searchText.isEmpty ? nil : searchText,
                status: filterStatus,
                gender: filterGender
            )
            if reset {
                cattle = response.items
            } else {
                cattle.append(contentsOf: response.items)
            }
            hasMore = response.hasMore ?? (response.items.count >= 20)
            currentPage += 1
        } catch {
            errorMessage = error.localizedDescription
        }

        isLoading = false
    }

    func loadCattleDetail(id: String) async {
        isLoading = true
        do {
            selectedCattle = try await service.getCattle(id: id)
        } catch {
            errorMessage = error.localizedDescription
        }
        isLoading = false
    }

    var totalCount: Int { cattle.count }
    var activeCount: Int { cattle.filter { $0.status == .active }.count }
    var bullCount: Int { cattle.filter { $0.gender == .male }.count }
    var cowCount: Int { cattle.filter { $0.gender == .female }.count }
}

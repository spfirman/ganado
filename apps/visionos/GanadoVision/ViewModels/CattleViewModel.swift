import Foundation
import SwiftUI

@MainActor
class CattleViewModel: ObservableObject {
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

    func deleteCattle(id: String) async {
        do {
            try await service.deleteCattle(id: id)
            cattle.removeAll { $0.id == id }
        } catch {
            errorMessage = error.localizedDescription
        }
    }

    func recordWeight(cattleId: String, weight: Double) async {
        do {
            _ = try await service.recordWeight(cattleId: cattleId, weight: weight)
            await loadCattleDetail(id: cattleId)
        } catch {
            errorMessage = error.localizedDescription
        }
    }

    var cattleByCategory: (bulls: [Cattle], cows: [Cattle], other: [Cattle]) {
        let bulls = cattle.filter { $0.gender == .male }
        let cows = cattle.filter { $0.gender == .female }
        let other = cattle.filter { $0.gender == nil }
        return (bulls, cows, other)
    }
}

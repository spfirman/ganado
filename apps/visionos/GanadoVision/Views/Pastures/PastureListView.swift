import SwiftUI

struct PastureListView: View {
    @StateObject private var viewModel = PastureViewModel()
    @State private var selectedPastureId: String?

    var body: some View {
        NavigationSplitView {
            List(viewModel.pastures, selection: $selectedPastureId) { pasture in
                PastureRowView(pasture: pasture)
                    .tag(pasture.id)
                    .onAppear {
                        if pasture.id == viewModel.pastures.last?.id {
                            Task { await viewModel.loadPastures() }
                        }
                    }
            }
            .navigationTitle("Pastures")
            .toolbar {
                ToolbarItem(placement: .topBarLeading) {
                    Menu {
                        Button("All") {
                            viewModel.filterStatus = nil
                            Task { await viewModel.loadPastures(reset: true) }
                        }
                        ForEach(PastureStatus.allCases, id: \.self) { status in
                            Button(status.label) {
                                viewModel.filterStatus = status
                                Task { await viewModel.loadPastures(reset: true) }
                            }
                        }
                    } label: {
                        Label("Filter", systemImage: "line.3.horizontal.decrease.circle")
                    }
                }
            }
            .task { await viewModel.loadPastures(reset: true) }
            .refreshable { await viewModel.loadPastures(reset: true) }
            .overlay {
                if viewModel.isLoading && viewModel.pastures.isEmpty {
                    LoadingView(message: "Loading pastures...")
                } else if viewModel.pastures.isEmpty && !viewModel.isLoading {
                    ContentUnavailableView("No Pastures", systemImage: "map", description: Text("Add pastures to track grazing."))
                }
            }
        } detail: {
            if let id = selectedPastureId {
                PastureDetailView(pastureId: id)
            } else {
                ContentUnavailableView("Select a Pasture", systemImage: "map", description: Text("Choose a pasture to view details."))
            }
        }
    }
}

struct PastureRowView: View {
    let pasture: Pasture

    var body: some View {
        HStack(spacing: 12) {
            Circle()
                .fill(statusColor)
                .frame(width: 12, height: 12)

            VStack(alignment: .leading, spacing: 4) {
                Text(pasture.displayName)
                    .fontWeight(.medium)
                HStack(spacing: 8) {
                    if let area = pasture.areaHectares {
                        Text("\(String(format: "%.1f", area)) ha")
                            .font(.caption)
                            .foregroundStyle(.secondary)
                    }
                    if let grass = pasture.grassType {
                        Text(grass)
                            .font(.caption)
                            .foregroundStyle(.secondary)
                    }
                }
            }

            Spacer()

            VStack(alignment: .trailing, spacing: 4) {
                if let current = pasture.currentCount, let capacity = pasture.capacity {
                    Text("\(current)/\(capacity)")
                        .font(.subheadline)
                        .fontWeight(.medium)
                    ProgressView(value: pasture.utilizationPercentage, total: 100)
                        .frame(width: 60)
                }
            }
        }
    }

    private var statusColor: Color {
        switch pasture.status {
        case .ACTIVE: return .green
        case .RESTING: return .blue
        case .OVER_GRAZED: return .red
        case nil: return .gray
        }
    }
}

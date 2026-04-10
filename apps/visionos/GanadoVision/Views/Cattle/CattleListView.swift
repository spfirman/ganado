import SwiftUI

struct CattleListView: View {
    @StateObject private var viewModel = CattleViewModel()
    @Environment(\.openWindow) var openWindow

    var body: some View {
        NavigationStack {
            List {
                ForEach(viewModel.cattle) { animal in
                    CattleRowView(cattle: animal)
                        .contentShape(Rectangle())
                        .onTapGesture {
                            openWindow(id: "cattle-detail", value: animal.id)
                        }
                        .onAppear {
                            if animal.id == viewModel.cattle.last?.id {
                                Task { await viewModel.loadCattle() }
                            }
                        }
                }
                .onDelete { indexSet in
                    for index in indexSet {
                        let animal = viewModel.cattle[index]
                        Task { await viewModel.deleteCattle(id: animal.id) }
                    }
                }
            }
            .navigationTitle("Herd")
            .searchable(text: $viewModel.searchText, prompt: "Search cattle...")
            .onChange(of: viewModel.searchText) {
                Task { await viewModel.loadCattle(reset: true) }
            }
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Menu {
                        Section("Status") {
                            Button("All") { viewModel.filterStatus = nil; Task { await viewModel.loadCattle(reset: true) } }
                            ForEach(CattleStatus.allCases, id: \.self) { status in
                                Button(status.rawValue.capitalized) {
                                    viewModel.filterStatus = status
                                    Task { await viewModel.loadCattle(reset: true) }
                                }
                            }
                        }
                        Section("Gender") {
                            Button("All") { viewModel.filterGender = nil; Task { await viewModel.loadCattle(reset: true) } }
                            ForEach(CattleGender.allCases, id: \.self) { gender in
                                Button(gender.rawValue.capitalized) {
                                    viewModel.filterGender = gender
                                    Task { await viewModel.loadCattle(reset: true) }
                                }
                            }
                        }
                    } label: {
                        Label("Filter", systemImage: "line.3.horizontal.decrease.circle")
                    }
                }
            }
            .task { await viewModel.loadCattle(reset: true) }
            .refreshable { await viewModel.loadCattle(reset: true) }
            .overlay {
                if viewModel.isLoading && viewModel.cattle.isEmpty {
                    LoadingView(message: "Loading herd...")
                } else if viewModel.cattle.isEmpty && !viewModel.isLoading {
                    ContentUnavailableView("No Cattle", systemImage: "pawprint", description: Text("Add cattle to get started."))
                }
            }
        }
    }
}

struct CattleRowView: View {
    let cattle: Cattle

    var body: some View {
        HStack(spacing: 16) {
            Circle()
                .fill(cattle.gender == .male ? Color.indigo : Color.pink)
                .frame(width: 44, height: 44)
                .overlay {
                    Text(cattle.gender == .male ? "M" : "F")
                        .font(.headline)
                        .foregroundStyle(.white)
                }

            VStack(alignment: .leading, spacing: 4) {
                Text("#\(cattle.displayNumber)")
                    .font(.headline)
                HStack(spacing: 8) {
                    if let weight = cattle.lastWeight ?? cattle.estimatedWeight {
                        Text("\(Int(weight)) kg")
                            .font(.caption)
                            .foregroundStyle(.secondary)
                    }
                    if let color = cattle.color {
                        Text(color.rawValue.capitalized)
                            .font(.caption)
                            .foregroundStyle(.secondary)
                    }
                }
            }

            Spacer()

            if let status = cattle.status {
                Text(status.rawValue.capitalized)
                    .font(.caption)
                    .fontWeight(.medium)
                    .padding(.horizontal, 8)
                    .padding(.vertical, 4)
                    .background(statusColor(status).opacity(0.2), in: Capsule())
                    .foregroundStyle(statusColor(status))
            }
        }
        .padding(.vertical, 4)
    }

    private func statusColor(_ status: CattleStatus) -> Color {
        switch status {
        case .active: return .green
        case .sold: return .blue
        case .dead: return .red
        case .transferred: return .orange
        }
    }
}

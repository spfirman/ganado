import SwiftUI

struct BreedingEventListView: View {
    @StateObject private var viewModel = BreedingViewModel()

    var body: some View {
        NavigationStack {
            List {
                ForEach(viewModel.events) { event in
                    BreedingEventRow(event: event)
                        .onAppear {
                            if event.id == viewModel.events.last?.id {
                                Task { await viewModel.loadEvents() }
                            }
                        }
                }
                .onDelete { indexSet in
                    for index in indexSet {
                        let event = viewModel.events[index]
                        Task { await viewModel.deleteEvent(id: event.id) }
                    }
                }
            }
            .navigationTitle("Breeding Events")
            .toolbar {
                ToolbarItem(placement: .topBarLeading) {
                    Menu {
                        Button("All Types") {
                            viewModel.filterType = nil
                            Task { await viewModel.loadEvents(reset: true) }
                        }
                        ForEach(BreedingEventType.allCases, id: \.self) { type in
                            Button {
                                viewModel.filterType = type
                                Task { await viewModel.loadEvents(reset: true) }
                            } label: {
                                Label(type.label, systemImage: type.icon)
                            }
                        }
                    } label: {
                        Label("Filter", systemImage: "line.3.horizontal.decrease.circle")
                    }
                }
            }
            .task { await viewModel.loadEvents(reset: true) }
            .refreshable { await viewModel.loadEvents(reset: true) }
            .overlay {
                if viewModel.isLoading && viewModel.events.isEmpty {
                    LoadingView(message: "Loading breeding events...")
                } else if viewModel.events.isEmpty && !viewModel.isLoading {
                    ContentUnavailableView("No Breeding Events", systemImage: "leaf", description: Text("Breeding events will appear here."))
                }
            }
        }
    }
}

struct BreedingEventRow: View {
    let event: BreedingEvent

    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: event.type?.icon ?? "leaf.fill")
                .font(.title3)
                .foregroundStyle(.green)
                .frame(width: 36)

            VStack(alignment: .leading, spacing: 4) {
                Text(event.type?.label ?? "Breeding Event")
                    .fontWeight(.medium)
                HStack(spacing: 8) {
                    if let cattle = event.cattleNumber {
                        Text("Dam #\(cattle)")
                            .font(.caption)
                            .foregroundStyle(.secondary)
                    }
                    if let sire = event.sireNumber {
                        Text("Sire #\(sire)")
                            .font(.caption)
                            .foregroundStyle(.secondary)
                    }
                }
            }

            Spacer()

            VStack(alignment: .trailing, spacing: 4) {
                if let status = event.pregnancyStatus {
                    Text(status.label)
                        .font(.caption)
                        .fontWeight(.medium)
                        .padding(.horizontal, 8)
                        .padding(.vertical, 3)
                        .background(pregnancyColor(status).opacity(0.2), in: Capsule())
                        .foregroundStyle(pregnancyColor(status))
                }
                if let date = event.eventDate {
                    Text(String(date.prefix(10)))
                        .font(.caption2)
                        .foregroundStyle(.secondary)
                }
            }
        }
        .padding(.vertical, 4)
    }

    private func pregnancyColor(_ status: PregnancyStatus) -> Color {
        switch status {
        case .OPEN: return .gray
        case .BRED: return .blue
        case .CONFIRMED: return .green
        case .LATE: return .orange
        case .CALVED: return .purple
        case .ABORTED: return .red
        }
    }
}

import SwiftUI

struct HealthEventListView: View {
    @StateObject private var viewModel = HealthViewModel()
    @State private var showForm = false

    var body: some View {
        NavigationStack {
            List {
                ForEach(viewModel.events) { event in
                    HealthEventRow(event: event)
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
            .navigationTitle("Health Events")
            .toolbar {
                ToolbarItem(placement: .topBarLeading) {
                    Menu {
                        Button("All Types") {
                            viewModel.filterType = nil
                            Task { await viewModel.loadEvents(reset: true) }
                        }
                        ForEach(HealthEventType.allCases, id: \.self) { type in
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
                    LoadingView(message: "Loading health events...")
                } else if viewModel.events.isEmpty && !viewModel.isLoading {
                    ContentUnavailableView("No Health Events", systemImage: "heart.text.square", description: Text("Health events will appear here."))
                }
            }
        }
    }
}

struct HealthEventRow: View {
    let event: HealthEvent

    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: event.type?.icon ?? "circle")
                .font(.title3)
                .foregroundStyle(.tint)
                .frame(width: 36)

            VStack(alignment: .leading, spacing: 4) {
                Text(event.displayName)
                    .fontWeight(.medium)
                HStack(spacing: 8) {
                    if let cattle = event.cattleNumber {
                        Text("Cattle #\(cattle)")
                            .font(.caption)
                            .foregroundStyle(.secondary)
                    }
                    if let type = event.type {
                        Text(type.label)
                            .font(.caption2)
                            .padding(.horizontal, 6)
                            .padding(.vertical, 2)
                            .background(.blue.opacity(0.15), in: Capsule())
                    }
                }
            }

            Spacer()

            VStack(alignment: .trailing, spacing: 4) {
                if let date = event.eventDate {
                    Text(String(date.prefix(10)))
                        .font(.caption)
                        .foregroundStyle(.secondary)
                }
                if let cost = event.cost {
                    Text("$\(String(format: "%.0f", cost))")
                        .font(.caption)
                        .fontWeight(.medium)
                }
            }
        }
        .padding(.vertical, 4)
    }
}

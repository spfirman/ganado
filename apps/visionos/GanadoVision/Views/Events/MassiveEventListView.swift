import SwiftUI

struct MassiveEventListView: View {
    @StateObject private var viewModel = CommerceViewModel()

    var body: some View {
        NavigationStack {
            List(viewModel.massiveEvents) { event in
                HStack(spacing: 12) {
                    Image(systemName: event.isOpen ? "calendar.badge.clock" : "calendar.badge.checkmark")
                        .font(.title3)
                        .foregroundStyle(event.isOpen ? .orange : .green)
                        .frame(width: 36)

                    VStack(alignment: .leading, spacing: 4) {
                        Text(event.displayName)
                            .fontWeight(.medium)
                        if let desc = event.description {
                            Text(desc)
                                .font(.caption)
                                .foregroundStyle(.secondary)
                                .lineLimit(2)
                        }
                    }

                    Spacer()

                    VStack(alignment: .trailing, spacing: 4) {
                        Text(event.isOpen ? "Open" : "Closed")
                            .font(.caption)
                            .fontWeight(.medium)
                            .padding(.horizontal, 8)
                            .padding(.vertical, 3)
                            .background((event.isOpen ? Color.orange : Color.green).opacity(0.2), in: Capsule())
                        if let date = event.createdAt {
                            Text(String(date.prefix(10)))
                                .font(.caption2)
                                .foregroundStyle(.secondary)
                        }
                    }
                }
                .padding(.vertical, 4)
            }
            .navigationTitle("Massive Events")
            .task { await viewModel.loadMassiveEvents() }
            .refreshable { await viewModel.loadMassiveEvents() }
            .overlay {
                if viewModel.isLoading && viewModel.massiveEvents.isEmpty {
                    LoadingView(message: "Loading events...")
                } else if viewModel.massiveEvents.isEmpty && !viewModel.isLoading {
                    ContentUnavailableView("No Events", systemImage: "calendar", description: Text("Massive events will appear here."))
                }
            }
        }
    }
}

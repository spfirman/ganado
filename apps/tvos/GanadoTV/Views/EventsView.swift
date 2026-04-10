import SwiftUI

struct EventsView: View {
    @StateObject private var viewModel = EventsViewModel()
    @State private var selectedCategory: TimelineEvent.EventCategory?

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 40) {
                    filterBar
                    timelineSection
                }
                .padding(60)
            }
            .navigationTitle("Event Timeline")
            .task {
                await viewModel.loadEvents()
            }
            .refreshable {
                await viewModel.loadEvents()
            }
        }
    }

    private var filterBar: some View {
        HStack(spacing: 20) {
            FilterButton(label: "All", isSelected: selectedCategory == nil) {
                selectedCategory = nil
            }
            FilterButton(label: "Health", isSelected: selectedCategory == .health) {
                selectedCategory = .health
            }
            FilterButton(label: "Breeding", isSelected: selectedCategory == .breeding) {
                selectedCategory = .breeding
            }
        }
    }

    private var filteredEvents: [TimelineEvent] {
        guard let category = selectedCategory else {
            return viewModel.timelineEvents
        }
        return viewModel.timelineEvents.filter { $0.category == category }
    }

    private var timelineSection: some View {
        LazyVStack(alignment: .leading, spacing: 0) {
            ForEach(filteredEvents) { event in
                TimelineEventRow(event: event)
            }
        }
    }
}

struct FilterButton: View {
    let label: String
    let isSelected: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Text(label)
                .fontWeight(isSelected ? .bold : .regular)
                .padding(.horizontal, 24)
                .padding(.vertical, 10)
        }
        .buttonStyle(.card)
    }
}

struct TimelineEventRow: View {
    let event: TimelineEvent

    var body: some View {
        Button { } label: {
            HStack(spacing: 20) {
                VStack {
                    Circle()
                        .fill(categoryColor)
                        .frame(width: 12, height: 12)
                    Rectangle()
                        .fill(categoryColor.opacity(0.3))
                        .frame(width: 2)
                }
                .frame(width: 20)

                Image(systemName: event.icon)
                    .font(.title2)
                    .foregroundStyle(categoryColor)
                    .frame(width: 44)

                VStack(alignment: .leading, spacing: 6) {
                    Text(event.title)
                        .font(.headline)

                    Text(event.subtitle)
                        .font(.subheadline)
                        .foregroundStyle(.secondary)
                }

                Spacer()

                if let date = event.date {
                    Text(date)
                        .font(.caption)
                        .foregroundStyle(.secondary)
                }
            }
            .padding(.vertical, 16)
            .padding(.horizontal, 20)
        }
        .buttonStyle(.card)
    }

    private var categoryColor: Color {
        switch event.category {
        case .health: return .red
        case .breeding: return .pink
        case .workOrder: return .orange
        }
    }
}

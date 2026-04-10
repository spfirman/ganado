import SwiftUI

struct FeedTypeListView: View {
    @StateObject private var viewModel = FeedViewModel()
    @State private var showRecords = false

    var body: some View {
        NavigationStack {
            List {
                if let summary = viewModel.summary {
                    Section("Summary") {
                        HStack {
                            StatCard(title: "Total Cost", value: "$\(String(format: "%.0f", summary.totalCost ?? 0))", icon: "dollarsign.circle", color: .green)
                            StatCard(title: "Records", value: "\(summary.recordsCount ?? 0)", icon: "list.bullet", color: .blue)
                        }
                        .listRowBackground(Color.clear)
                    }
                }

                Section("Feed Types") {
                    ForEach(viewModel.feedTypes) { feed in
                        FeedTypeRow(feed: feed)
                            .onAppear {
                                if feed.id == viewModel.feedTypes.last?.id {
                                    Task { await viewModel.loadFeedTypes() }
                                }
                            }
                    }
                    .onDelete { indexSet in
                        for index in indexSet {
                            let feed = viewModel.feedTypes[index]
                            Task { await viewModel.deleteFeedType(id: feed.id) }
                        }
                    }
                }
            }
            .navigationTitle("Feed Management")
            .toolbar {
                ToolbarItem(placement: .topBarLeading) {
                    Menu {
                        Button("All") {
                            viewModel.filterCategory = nil
                            Task { await viewModel.loadFeedTypes(reset: true) }
                        }
                        ForEach(FeedCategory.allCases, id: \.self) { cat in
                            Button {
                                viewModel.filterCategory = cat
                                Task { await viewModel.loadFeedTypes(reset: true) }
                            } label: {
                                Label(cat.label, systemImage: cat.icon)
                            }
                        }
                    } label: {
                        Label("Filter", systemImage: "line.3.horizontal.decrease.circle")
                    }
                }
                ToolbarItem(placement: .topBarTrailing) {
                    Button {
                        showRecords = true
                    } label: {
                        Label("Records", systemImage: "list.bullet.rectangle")
                    }
                }
            }
            .task {
                await viewModel.loadFeedTypes(reset: true)
                await viewModel.loadSummary()
            }
            .refreshable {
                await viewModel.loadFeedTypes(reset: true)
                await viewModel.loadSummary()
            }
            .sheet(isPresented: $showRecords) {
                FeedingRecordListView()
            }
            .overlay {
                if viewModel.isLoading && viewModel.feedTypes.isEmpty {
                    LoadingView(message: "Loading feed types...")
                } else if viewModel.feedTypes.isEmpty && !viewModel.isLoading {
                    ContentUnavailableView("No Feed Types", systemImage: "leaf", description: Text("Add feed types to manage inventory."))
                }
            }
        }
    }
}

struct FeedTypeRow: View {
    let feed: FeedType

    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: feed.category?.icon ?? "circle")
                .font(.title3)
                .foregroundStyle(.green)
                .frame(width: 36)

            VStack(alignment: .leading, spacing: 4) {
                Text(feed.displayName)
                    .fontWeight(.medium)
                HStack(spacing: 8) {
                    if let cat = feed.category {
                        Text(cat.label)
                            .font(.caption)
                            .foregroundStyle(.secondary)
                    }
                    if let unit = feed.unit {
                        Text("per \(unit)")
                            .font(.caption)
                            .foregroundStyle(.secondary)
                    }
                }
            }

            Spacer()

            VStack(alignment: .trailing, spacing: 4) {
                if let stock = feed.inStock {
                    Text("\(String(format: "%.0f", stock)) \(feed.unit ?? "")")
                        .font(.subheadline)
                        .fontWeight(.medium)
                        .foregroundStyle(feed.isOutOfStock ? .red : feed.isLowStock ? .orange : .primary)
                }
                if let price = feed.pricePerUnit {
                    Text("$\(String(format: "%.0f", price))/\(feed.unit ?? "unit")")
                        .font(.caption)
                        .foregroundStyle(.secondary)
                }
            }
        }
    }
}

struct FeedingRecordListView: View {
    @StateObject private var viewModel = FeedViewModel()
    @Environment(\.dismiss) var dismiss

    var body: some View {
        NavigationStack {
            List(viewModel.feedingRecords) { record in
                HStack {
                    VStack(alignment: .leading, spacing: 4) {
                        Text(record.feedTypeName ?? "Unknown")
                            .fontWeight(.medium)
                        Text("\(String(format: "%.1f", record.quantity ?? 0)) \(record.unit ?? "")")
                            .font(.caption)
                            .foregroundStyle(.secondary)
                    }
                    Spacer()
                    VStack(alignment: .trailing, spacing: 4) {
                        if let cost = record.cost {
                            Text("$\(String(format: "%.0f", cost))")
                                .fontWeight(.medium)
                        }
                        if let date = record.fedAt {
                            Text(String(date.prefix(10)))
                                .font(.caption)
                                .foregroundStyle(.secondary)
                        }
                    }
                }
            }
            .navigationTitle("Feeding Records")
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Done") { dismiss() }
                }
            }
            .task { await viewModel.loadFeedingRecords() }
        }
    }
}

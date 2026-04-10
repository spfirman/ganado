import SwiftUI

struct WorkOrderListView: View {
    @StateObject private var viewModel = CommerceViewModel()
    @State private var filterStatus: WorkOrderStatus?

    var body: some View {
        NavigationStack {
            List {
                ForEach(viewModel.workOrders) { order in
                    WorkOrderRow(order: order)
                }
                .onDelete { indexSet in
                    for index in indexSet {
                        let order = viewModel.workOrders[index]
                        Task { await viewModel.deleteWorkOrder(id: order.id) }
                    }
                }
            }
            .navigationTitle("Work Orders")
            .toolbar {
                ToolbarItem(placement: .topBarLeading) {
                    Menu {
                        Button("All") {
                            filterStatus = nil
                            Task { await viewModel.loadWorkOrders() }
                        }
                        ForEach(WorkOrderStatus.allCases, id: \.self) { status in
                            Button(status.label) {
                                filterStatus = status
                                Task { await viewModel.loadWorkOrders(status: status) }
                            }
                        }
                    } label: {
                        Label("Filter", systemImage: "line.3.horizontal.decrease.circle")
                    }
                }
            }
            .task { await viewModel.loadWorkOrders(status: filterStatus) }
            .refreshable { await viewModel.loadWorkOrders(status: filterStatus) }
            .overlay {
                if viewModel.isLoading && viewModel.workOrders.isEmpty {
                    LoadingView(message: "Loading work orders...")
                } else if viewModel.workOrders.isEmpty && !viewModel.isLoading {
                    ContentUnavailableView("No Work Orders", systemImage: "checklist", description: Text("Work orders will appear here."))
                }
            }
        }
    }
}

struct WorkOrderRow: View {
    let order: WorkOrder

    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: order.type?.icon ?? "list.bullet")
                .font(.title3)
                .foregroundStyle(priorityColor)
                .frame(width: 36)

            VStack(alignment: .leading, spacing: 4) {
                Text(order.displayTitle)
                    .fontWeight(.medium)
                HStack(spacing: 8) {
                    if let type = order.type {
                        Text(type.label)
                            .font(.caption)
                            .foregroundStyle(.secondary)
                    }
                    if let assigned = order.assignedToName {
                        Text(assigned)
                            .font(.caption)
                            .foregroundStyle(.secondary)
                    }
                }
            }

            Spacer()

            VStack(alignment: .trailing, spacing: 4) {
                if let status = order.status {
                    Text(status.label)
                        .font(.caption)
                        .fontWeight(.medium)
                        .padding(.horizontal, 8)
                        .padding(.vertical, 3)
                        .background(statusColor(status).opacity(0.2), in: Capsule())
                        .foregroundStyle(statusColor(status))
                }
                if let priority = order.priority {
                    Text(priority.label)
                        .font(.caption2)
                        .foregroundStyle(priorityColor)
                }
                if let due = order.dueDate {
                    Text(String(due.prefix(10)))
                        .font(.caption2)
                        .foregroundStyle(.secondary)
                }
            }
        }
        .padding(.vertical, 4)
    }

    private var priorityColor: Color {
        switch order.priority {
        case .URGENT: return .red
        case .HIGH: return .orange
        case .MEDIUM: return .yellow
        case .LOW: return .blue
        case nil: return .gray
        }
    }

    private func statusColor(_ status: WorkOrderStatus) -> Color {
        switch status {
        case .PENDING: return .orange
        case .IN_PROGRESS: return .blue
        case .COMPLETED: return .green
        case .CANCELLED: return .gray
        }
    }
}

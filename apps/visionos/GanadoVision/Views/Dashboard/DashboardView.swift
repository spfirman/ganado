import SwiftUI

struct DashboardView: View {
    @StateObject private var viewModel = DashboardViewModel()
    @EnvironmentObject var appState: AppState
    @Environment(\.openImmersiveSpace) var openImmersiveSpace
    @Environment(\.dismissImmersiveSpace) var dismissImmersiveSpace

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 24) {
                    headerSection
                    herdOverviewSection
                    quickActionsSection
                    recentEventsSection
                    pastureSection
                }
                .padding(32)
            }
            .navigationTitle("Ganado Dashboard")
            .task { await viewModel.loadDashboard() }
            .refreshable { await viewModel.loadDashboard() }
            .overlay {
                if viewModel.isLoading && viewModel.cattle.isEmpty {
                    LoadingView(message: "Loading dashboard...")
                }
            }
        }
    }

    private var headerSection: some View {
        HStack {
            VStack(alignment: .leading, spacing: 8) {
                Text("Herd Overview")
                    .font(.largeTitle)
                    .fontWeight(.bold)
                Text("\(viewModel.summary.activeCattle) active cattle")
                    .font(.title3)
                    .foregroundStyle(.secondary)
            }
            Spacer()
            Button {
                Task {
                    if appState.isImmersiveSpaceOpen {
                        await dismissImmersiveSpace()
                    } else {
                        await openImmersiveSpace(id: "farm-overview")
                    }
                    appState.isImmersiveSpaceOpen.toggle()
                }
            } label: {
                Label(
                    appState.isImmersiveSpaceOpen ? "Exit Farm View" : "Open Farm View",
                    systemImage: appState.isImmersiveSpaceOpen ? "xmark.circle" : "view.3d"
                )
            }
            .buttonStyle(.borderedProminent)
        }
    }

    private var herdOverviewSection: some View {
        HStack(spacing: 16) {
            StatCard(title: "Total", value: "\(viewModel.summary.totalCattle)", icon: "pawprint.fill", color: .blue)
            StatCard(title: "Bulls", value: "\(viewModel.summary.bulls)", icon: "circle.fill", color: .indigo)
            StatCard(title: "Cows", value: "\(viewModel.summary.cows)", icon: "circle.fill", color: .pink)
            StatCard(title: "Pastures", value: "\(viewModel.summary.activePastures)/\(viewModel.summary.totalPastures)", icon: "map.fill", color: .green)
            StatCard(title: "Tasks", value: "\(viewModel.summary.pendingWorkOrders)", icon: "checklist", color: .orange)
        }
    }

    private var quickActionsSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Quick Actions")
                .font(.headline)
            HStack(spacing: 12) {
                QuickActionButton(title: "Add Cattle", icon: "plus.circle.fill") {
                    appState.selectedTab = .cattle
                }
                QuickActionButton(title: "Record Event", icon: "calendar.badge.plus") {
                    appState.selectedTab = .health
                }
                QuickActionButton(title: "View Pastures", icon: "map.fill") {
                    appState.selectedTab = .pastures
                }
                QuickActionButton(title: "Work Orders", icon: "checklist") {
                    appState.selectedTab = .workOrders
                }
            }
        }
    }

    private var recentEventsSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Recent Health Events")
                .font(.headline)

            if viewModel.summary.recentEvents.isEmpty {
                Text("No recent events")
                    .foregroundStyle(.secondary)
                    .frame(maxWidth: .infinity)
                    .padding()
            } else {
                ForEach(viewModel.summary.recentEvents.prefix(5)) { event in
                    HStack {
                        Image(systemName: event.type?.icon ?? "circle")
                            .foregroundStyle(.tint)
                        VStack(alignment: .leading) {
                            Text(event.displayName)
                                .fontWeight(.medium)
                            if let cattle = event.cattleNumber {
                                Text("Cattle #\(cattle)")
                                    .font(.caption)
                                    .foregroundStyle(.secondary)
                            }
                        }
                        Spacer()
                        if let date = event.eventDate {
                            Text(date.prefix(10))
                                .font(.caption)
                                .foregroundStyle(.secondary)
                        }
                    }
                    .padding(.horizontal)
                    .padding(.vertical, 8)
                    .background(.regularMaterial, in: RoundedRectangle(cornerRadius: 12))
                }
            }
        }
    }

    private var pastureSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Upcoming Breedings")
                .font(.headline)

            if viewModel.summary.upcomingBreedings.isEmpty {
                Text("No upcoming breeding events")
                    .foregroundStyle(.secondary)
                    .frame(maxWidth: .infinity)
                    .padding()
            } else {
                ForEach(viewModel.summary.upcomingBreedings.prefix(5)) { event in
                    HStack {
                        Image(systemName: event.type?.icon ?? "leaf.fill")
                            .foregroundStyle(.green)
                        VStack(alignment: .leading) {
                            Text(event.type?.label ?? "Breeding Event")
                                .fontWeight(.medium)
                            if let cattle = event.cattleNumber {
                                Text("Cattle #\(cattle)")
                                    .font(.caption)
                                    .foregroundStyle(.secondary)
                            }
                        }
                        Spacer()
                        if let status = event.pregnancyStatus {
                            Text(status.label)
                                .font(.caption)
                                .padding(.horizontal, 8)
                                .padding(.vertical, 4)
                                .background(.green.opacity(0.2), in: Capsule())
                        }
                    }
                    .padding(.horizontal)
                    .padding(.vertical, 8)
                    .background(.regularMaterial, in: RoundedRectangle(cornerRadius: 12))
                }
            }
        }
    }
}

struct QuickActionButton: View {
    let title: String
    let icon: String
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            VStack(spacing: 8) {
                Image(systemName: icon)
                    .font(.title2)
                Text(title)
                    .font(.caption)
            }
            .frame(maxWidth: .infinity)
            .padding()
            .background(.regularMaterial, in: RoundedRectangle(cornerRadius: 16))
        }
        .buttonStyle(.plain)
    }
}

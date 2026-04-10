import SwiftUI

struct HerdView: View {
    @StateObject private var viewModel = DashboardViewModel()

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 40) {
                    herdSummarySection
                    recentEventsSection
                    breedingSection
                }
                .padding(60)
            }
            .navigationTitle("Herd Overview")
            .task {
                await viewModel.loadDashboard()
            }
            .refreshable {
                await viewModel.loadDashboard()
            }
        }
    }

    private var herdSummarySection: some View {
        VStack(alignment: .leading, spacing: 20) {
            Text("Summary")
                .font(.title2)
                .fontWeight(.bold)

            HStack(spacing: 30) {
                StatCard(title: "Total Head", value: "\(viewModel.summary.totalCattle)", icon: "pawprint.fill", color: .blue)
                StatCard(title: "Active", value: "\(viewModel.summary.activeCattle)", icon: "checkmark.circle.fill", color: .green)
                StatCard(title: "Bulls", value: "\(viewModel.summary.bulls)", icon: "bolt.fill", color: .orange)
                StatCard(title: "Cows", value: "\(viewModel.summary.cows)", icon: "heart.fill", color: .pink)
                StatCard(title: "Avg Weight", value: String(format: "%.0f kg", viewModel.summary.averageWeight), icon: "scalemass.fill", color: .purple)
            }

            HStack(spacing: 30) {
                StatCard(title: "Active Pastures", value: "\(viewModel.summary.activePastures)/\(viewModel.summary.totalPastures)", icon: "map.fill", color: .green)
                StatCard(title: "Pending Tasks", value: "\(viewModel.summary.pendingWorkOrders)", icon: "checklist", color: .yellow)
                StatCard(title: "Sold", value: "\(viewModel.summary.soldThisMonth)", icon: "dollarsign.circle.fill", color: .mint)
            }
        }
    }

    private var recentEventsSection: some View {
        VStack(alignment: .leading, spacing: 20) {
            Text("Recent Health Events")
                .font(.title2)
                .fontWeight(.bold)

            if viewModel.summary.recentHealthEvents.isEmpty {
                Text("No recent health events")
                    .foregroundStyle(.secondary)
                    .padding()
            } else {
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 20) {
                        ForEach(viewModel.summary.recentHealthEvents) { event in
                            HealthEventCard(event: event)
                        }
                    }
                }
            }
        }
    }

    private var breedingSection: some View {
        VStack(alignment: .leading, spacing: 20) {
            Text("Breeding Activity")
                .font(.title2)
                .fontWeight(.bold)

            if viewModel.summary.upcomingBreedings.isEmpty {
                Text("No recent breeding events")
                    .foregroundStyle(.secondary)
                    .padding()
            } else {
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 20) {
                        ForEach(viewModel.summary.upcomingBreedings) { event in
                            BreedingEventCard(event: event)
                        }
                    }
                }
            }
        }
    }
}

struct StatCard: View {
    let title: String
    let value: String
    let icon: String
    let color: Color

    var body: some View {
        Button { } label: {
            VStack(spacing: 12) {
                Image(systemName: icon)
                    .font(.system(size: 36))
                    .foregroundStyle(color)

                Text(value)
                    .font(.system(size: 42, weight: .bold, design: .rounded))

                Text(title)
                    .font(.caption)
                    .foregroundStyle(.secondary)
            }
            .frame(width: 200, height: 180)
        }
        .buttonStyle(.card)
    }
}

struct HealthEventCard: View {
    let event: HealthEvent

    var body: some View {
        Button { } label: {
            VStack(alignment: .leading, spacing: 10) {
                HStack {
                    Image(systemName: event.type?.icon ?? "heart.fill")
                        .foregroundStyle(.red)
                    Text(event.displayName)
                        .fontWeight(.semibold)
                }

                Text("Animal #\(event.cattleNumber ?? "N/A")")
                    .font(.subheadline)
                    .foregroundStyle(.secondary)

                if let date = event.eventDate {
                    Text(date)
                        .font(.caption)
                        .foregroundStyle(.secondary)
                }

                if let medication = event.medication {
                    Text(medication)
                        .font(.caption2)
                        .foregroundStyle(.secondary)
                }
            }
            .frame(width: 280, height: 160, alignment: .topLeading)
            .padding()
        }
        .buttonStyle(.card)
    }
}

struct BreedingEventCard: View {
    let event: BreedingEvent

    var body: some View {
        Button { } label: {
            VStack(alignment: .leading, spacing: 10) {
                HStack {
                    Image(systemName: event.type?.icon ?? "heart.fill")
                        .foregroundStyle(.pink)
                    Text(event.type?.label ?? "Breeding")
                        .fontWeight(.semibold)
                }

                Text("Dam #\(event.cattleNumber ?? "N/A")")
                    .font(.subheadline)
                    .foregroundStyle(.secondary)

                if let status = event.pregnancyStatus {
                    Text(status.label)
                        .font(.caption)
                        .padding(.horizontal, 10)
                        .padding(.vertical, 4)
                        .background(pregnancyColor(status).opacity(0.2))
                        .foregroundStyle(pregnancyColor(status))
                        .clipShape(Capsule())
                }

                if let date = event.eventDate {
                    Text(date)
                        .font(.caption)
                        .foregroundStyle(.secondary)
                }
            }
            .frame(width: 280, height: 160, alignment: .topLeading)
            .padding()
        }
        .buttonStyle(.card)
    }

    private func pregnancyColor(_ status: PregnancyStatus) -> Color {
        switch status {
        case .OPEN: return .gray
        case .BRED: return .blue
        case .CONFIRMED: return .green
        case .LATE: return .orange
        case .CALVED: return .mint
        case .ABORTED: return .red
        }
    }
}

import SwiftUI

struct AlertItem: Identifiable {
    let id = UUID()
    let title: String
    let message: String
    let type: AlertType
    let date: String?
    let cattleId: String?

    enum AlertType {
        case health, breeding, vaccination, weight, pasture

        var icon: String {
            switch self {
            case .health: return "heart.text.square.fill"
            case .breeding: return "leaf.fill"
            case .vaccination: return "syringe.fill"
            case .weight: return "scalemass.fill"
            case .pasture: return "map.fill"
            }
        }

        var color: Color {
            switch self {
            case .health: return .red
            case .breeding: return .purple
            case .vaccination: return .orange
            case .weight: return .blue
            case .pasture: return .green
            }
        }
    }
}

struct AlertCenterView: View {
    @StateObject private var healthVM = HealthViewModel()
    @StateObject private var breedingVM = BreedingViewModel()
    @State private var alerts: [AlertItem] = []

    var body: some View {
        NavigationStack {
            List(alerts) { alert in
                HStack(spacing: 12) {
                    Image(systemName: alert.type.icon)
                        .font(.title3)
                        .foregroundStyle(alert.type.color)
                        .frame(width: 36)

                    VStack(alignment: .leading, spacing: 4) {
                        Text(alert.title)
                            .fontWeight(.medium)
                        Text(alert.message)
                            .font(.caption)
                            .foregroundStyle(.secondary)
                            .lineLimit(2)
                    }

                    Spacer()

                    if let date = alert.date {
                        Text(String(date.prefix(10)))
                            .font(.caption2)
                            .foregroundStyle(.secondary)
                    }
                }
                .padding(.vertical, 4)
            }
            .navigationTitle("Alert Center")
            .task { await loadAlerts() }
            .refreshable { await loadAlerts() }
            .overlay {
                if alerts.isEmpty {
                    ContentUnavailableView("No Alerts", systemImage: "bell.slash", description: Text("You're all caught up."))
                }
            }
        }
    }

    private func loadAlerts() async {
        var newAlerts: [AlertItem] = []

        // Generate alerts from health events needing follow-up
        do {
            let healthResponse = try await HealthService().listHealthEvents(limit: 50)
            for event in healthResponse.items {
                if let followUp = event.followUpDate, event.status != "completed" {
                    newAlerts.append(AlertItem(
                        title: "Follow-up Required",
                        message: "\(event.displayName) for cattle #\(event.cattleNumber ?? "?")",
                        type: .health,
                        date: followUp,
                        cattleId: event.idCattle
                    ))
                }
            }
        } catch {}

        // Generate alerts from breeding events
        do {
            let breedingResponse = try await BreedingService().listBreedingEvents(limit: 50)
            for event in breedingResponse.items {
                if event.pregnancyStatus == .CONFIRMED, let expected = event.expectedCalvingDate {
                    newAlerts.append(AlertItem(
                        title: "Calving Expected",
                        message: "Cattle #\(event.cattleNumber ?? "?") due for calving",
                        type: .breeding,
                        date: expected,
                        cattleId: event.idCattle
                    ))
                }
            }
        } catch {}

        alerts = newAlerts.sorted { ($0.date ?? "") < ($1.date ?? "") }
    }
}

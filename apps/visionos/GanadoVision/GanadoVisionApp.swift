import SwiftUI

@main
struct GanadoVisionApp: App {
    @StateObject private var authService = AuthService()
    @StateObject private var appState = AppState()

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(authService)
                .environmentObject(appState)
        }
        .defaultSize(width: 1200, height: 800)

        WindowGroup(id: "cattle-detail", for: String.self) { $cattleId in
            if let id = cattleId {
                CattleDetailView(cattleId: id)
                    .environmentObject(authService)
            }
        }
        .defaultSize(width: 600, height: 800)

        WindowGroup(id: "event-form", for: String.self) { $cattleId in
            if let id = cattleId {
                HealthEventFormView(cattleId: id)
                    .environmentObject(authService)
            }
        }
        .defaultSize(width: 500, height: 600)

        ImmersiveSpace(id: "farm-overview") {
            FarmOverviewSpace()
                .environmentObject(authService)
                .environmentObject(appState)
        }
        .immersionStyle(selection: .constant(.mixed), in: .mixed)
    }
}

@MainActor
class AppState: ObservableObject {
    enum Tab: String, CaseIterable {
        case dashboard = "Dashboard"
        case cattle = "Herd"
        case health = "Health"
        case breeding = "Breeding"
        case pastures = "Pastures"
        case feed = "Feed"
        case events = "Events"
        case workOrders = "Tasks"
        case commerce = "Commerce"
        case alerts = "Alerts"
        case settings = "Settings"

        var icon: String {
            switch self {
            case .dashboard: return "chart.bar.fill"
            case .cattle: return "pawprint.fill"
            case .health: return "heart.text.square.fill"
            case .breeding: return "leaf.fill"
            case .pastures: return "map.fill"
            case .feed: return "takeoutbag.and.cup.and.straw.fill"
            case .events: return "calendar.badge.plus"
            case .workOrders: return "checklist"
            case .commerce: return "dollarsign.circle.fill"
            case .alerts: return "bell.badge.fill"
            case .settings: return "gearshape.fill"
            }
        }
    }

    @Published var selectedTab: Tab = .dashboard
    @Published var isImmersiveSpaceOpen = false
}

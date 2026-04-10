import SwiftUI

struct ContentView: View {
    @EnvironmentObject var authService: AuthService
    @EnvironmentObject var appState: AppState

    var body: some View {
        Group {
            if authService.isAuthenticated {
                MainNavigationView()
            } else {
                LoginView()
            }
        }
    }
}

struct MainNavigationView: View {
    @EnvironmentObject var appState: AppState

    var body: some View {
        TabView(selection: $appState.selectedTab) {
            DashboardView()
                .tabItem { Label("Dashboard", systemImage: "chart.bar.fill") }
                .tag(AppState.Tab.dashboard)

            CattleListView()
                .tabItem { Label("Herd", systemImage: "pawprint.fill") }
                .tag(AppState.Tab.cattle)

            HealthEventListView()
                .tabItem { Label("Health", systemImage: "heart.text.square.fill") }
                .tag(AppState.Tab.health)

            BreedingEventListView()
                .tabItem { Label("Breeding", systemImage: "leaf.fill") }
                .tag(AppState.Tab.breeding)

            PastureListView()
                .tabItem { Label("Pastures", systemImage: "map.fill") }
                .tag(AppState.Tab.pastures)

            FeedTypeListView()
                .tabItem { Label("Feed", systemImage: "takeoutbag.and.cup.and.straw.fill") }
                .tag(AppState.Tab.feed)

            MassiveEventListView()
                .tabItem { Label("Events", systemImage: "calendar.badge.plus") }
                .tag(AppState.Tab.events)

            WorkOrderListView()
                .tabItem { Label("Tasks", systemImage: "checklist") }
                .tag(AppState.Tab.workOrders)

            CommerceView()
                .tabItem { Label("Commerce", systemImage: "dollarsign.circle.fill") }
                .tag(AppState.Tab.commerce)

            AlertCenterView()
                .tabItem { Label("Alerts", systemImage: "bell.badge.fill") }
                .tag(AppState.Tab.alerts)

            SettingsView()
                .tabItem { Label("Settings", systemImage: "gearshape.fill") }
                .tag(AppState.Tab.settings)
        }
        .ornament(attachmentAnchor: .scene(.leading)) {
            NavigationOrnament()
        }
    }
}

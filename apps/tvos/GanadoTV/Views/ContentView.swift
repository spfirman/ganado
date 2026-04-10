import SwiftUI

struct ContentView: View {
    @EnvironmentObject var authService: AuthService

    var body: some View {
        if authService.isAuthenticated {
            MainTabView()
        } else {
            LoginView()
        }
    }
}

struct MainTabView: View {
    var body: some View {
        TabView {
            HerdView()
                .tabItem {
                    Label("Herd", systemImage: "pawprint.fill")
                }

            AnimalsView()
                .tabItem {
                    Label("Animals", systemImage: "list.bullet.rectangle.fill")
                }

            EventsView()
                .tabItem {
                    Label("Events", systemImage: "calendar.badge.plus")
                }

            MarketView()
                .tabItem {
                    Label("Market", systemImage: "dollarsign.circle.fill")
                }

            SettingsView()
                .tabItem {
                    Label("Settings", systemImage: "gearshape.fill")
                }
        }
    }
}

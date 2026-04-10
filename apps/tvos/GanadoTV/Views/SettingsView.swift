import SwiftUI

struct SettingsView: View {
    @EnvironmentObject var authService: AuthService

    var body: some View {
        NavigationStack {
            List {
                Section("Account") {
                    if let user = authService.currentUser {
                        LabeledContent("Name", value: user.name ?? "N/A")
                        LabeledContent("Email", value: user.email ?? "N/A")
                        LabeledContent("Role", value: user.role ?? "N/A")
                    }
                }

                Section("Application") {
                    LabeledContent("Version", value: "1.0.0")
                    LabeledContent("Build", value: "5")
                    LabeledContent("Platform", value: "tvOS")
                }

                Section {
                    Button(role: .destructive) {
                        Task {
                            await authService.logout()
                        }
                    } label: {
                        Label("Sign Out", systemImage: "rectangle.portrait.and.arrow.right")
                    }
                }
            }
            .navigationTitle("Settings")
        }
    }
}

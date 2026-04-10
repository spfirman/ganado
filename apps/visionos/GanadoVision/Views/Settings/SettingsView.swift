import SwiftUI

struct SettingsView: View {
    @EnvironmentObject var authService: AuthService
    @EnvironmentObject var appState: AppState
    @Environment(\.openImmersiveSpace) var openImmersiveSpace
    @Environment(\.dismissImmersiveSpace) var dismissImmersiveSpace

    var body: some View {
        NavigationStack {
            Form {
                Section("Account") {
                    if let user = authService.currentUser {
                        LabeledContent("Name", value: user.name ?? "N/A")
                        LabeledContent("Email", value: user.email ?? "N/A")
                        LabeledContent("Role", value: user.role ?? "N/A")
                    }
                }

                Section("Spatial") {
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
                            appState.isImmersiveSpaceOpen ? "Close Farm Overview" : "Open Farm Overview",
                            systemImage: "view.3d"
                        )
                    }
                }

                Section("App Info") {
                    LabeledContent("Version", value: Bundle.main.infoDictionary?["CFBundleShortVersionString"] as? String ?? "1.0.0")
                    LabeledContent("Build", value: Bundle.main.infoDictionary?["CFBundleVersion"] as? String ?? "5")
                    LabeledContent("Bundle ID", value: "co.com.gpcb.ganado")
                }

                Section {
                    Button(role: .destructive) {
                        Task { await authService.logout() }
                    } label: {
                        Label("Sign Out", systemImage: "rectangle.portrait.and.arrow.right")
                    }
                }
            }
            .navigationTitle("Settings")
        }
    }
}

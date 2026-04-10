import Foundation
import SwiftUI

struct LoginRequest: Encodable {
    let username: String
    let password: String
}

@MainActor
class AuthService: ObservableObject {
    @Published var isAuthenticated = false
    @Published var currentUser: AuthUser?
    @Published var permissions: [String] = []
    @Published var isLoading = false
    @Published var errorMessage: String?

    private let api = APIClient.shared
    private let tokenKey = "ganado_auth_token"
    private let refreshTokenKey = "ganado_refresh_token"

    init() {
        if let token = UserDefaults.standard.string(forKey: tokenKey) {
            api.authToken = token
            isAuthenticated = true
        }
    }

    func login(username: String, password: String) async {
        isLoading = true
        errorMessage = nil

        do {
            let response: AuthResponse = try await api.post(
                path: "/auth/login",
                body: LoginRequest(username: username, password: password)
            )

            api.authToken = response.accessToken
            UserDefaults.standard.set(response.accessToken, forKey: tokenKey)
            if let refresh = response.refreshToken {
                UserDefaults.standard.set(refresh, forKey: refreshTokenKey)
            }

            currentUser = response.user
            permissions = response.permissions ?? []
            isAuthenticated = true
        } catch let error as APIError {
            errorMessage = error.errorDescription
        } catch {
            errorMessage = error.localizedDescription
        }

        isLoading = false
    }

    func logout() async {
        let refreshToken = UserDefaults.standard.string(forKey: refreshTokenKey)
        if let token = refreshToken {
            struct LogoutBody: Encodable { let refreshToken: String }
            let _: EmptyResponse? = try? await api.post(path: "/auth/logout", body: LogoutBody(refreshToken: token))
        }

        api.authToken = nil
        UserDefaults.standard.removeObject(forKey: tokenKey)
        UserDefaults.standard.removeObject(forKey: refreshTokenKey)
        currentUser = nil
        permissions = []
        isAuthenticated = false
    }
}

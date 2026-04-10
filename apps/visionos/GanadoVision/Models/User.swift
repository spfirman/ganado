import Foundation

struct AuthResponse: Codable {
    let accessToken: String
    let refreshToken: String?
    let expiresIn: Int?
    let user: AuthUser?
    let permissions: [String]?

    enum CodingKeys: String, CodingKey {
        case accessToken = "access_token"
        case refreshToken = "refresh_token"
        case expiresIn = "expires_in"
        case user, permissions
    }
}

struct AuthUser: Codable, Identifiable {
    let id: String
    let name: String?
    let email: String?
    let role: String?
    let idTenant: String?
}

struct Brand: Codable, Identifiable, Hashable {
    let id: String
    let idTenant: String?
    let name: String?
    let imageUrl: String?
    let createdAt: String?
    let updatedAt: String?
}

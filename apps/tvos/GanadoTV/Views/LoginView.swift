import SwiftUI

struct LoginView: View {
    @EnvironmentObject var authService: AuthService
    @State private var username = ""
    @State private var password = ""

    // OTP state
    @State private var otpRequired = false
    @State private var tempToken = ""
    @State private var otpCode = ""

    // Ganado web palette
    private let primaryGreen = Color(red: 0.18, green: 0.49, blue: 0.20)  // #2E7D32
    private let primaryDark  = Color(red: 0.05, green: 0.39, blue: 0.11)  // #0d631b

    var body: some View {
        VStack(spacing: 60) {
            // ── Logo & header ──
            VStack(spacing: 16) {
                ZStack {
                    Circle()
                        .fill(primaryGreen)
                        .frame(width: 96, height: 96)
                    Image(systemName: "pawprint.circle.fill")
                        .font(.system(size: 56))
                        .foregroundStyle(.white)
                }

                Text(I18nService.shared.t("app.name"))
                    .font(.largeTitle)
                    .fontWeight(.heavy)
                    .foregroundStyle(primaryDark)

                Text(otpRequired
                     ? I18nService.shared.t("auth.otp.title")
                     : I18nService.shared.t("app.subtitle"))
                    .font(.headline)
                    .foregroundStyle(.secondary)
            }

            // ── Error display ──
            if let error = authService.errorMessage {
                Text(error)
                    .foregroundStyle(.red)
                    .font(.callout)
            }

            // ── OTP form or login form ──
            if otpRequired {
                otpForm
            } else {
                loginForm
            }
        }
        .padding(80)
    }

    // MARK: - Login form

    private var loginForm: some View {
        VStack(spacing: 30) {
            TextField(I18nService.shared.t("auth.username"), text: $username)
                .textFieldStyle(.automatic)

            SecureField(I18nService.shared.t("auth.password"), text: $password)
                .textFieldStyle(.automatic)

            Button(action: login) {
                if authService.isLoading {
                    ProgressView()
                } else {
                    Text(I18nService.shared.t("auth.login"))
                        .frame(maxWidth: .infinity)
                }
            }
            .disabled(username.isEmpty || password.isEmpty || authService.isLoading)
        }
        .frame(maxWidth: 500)
    }

    // MARK: - OTP form

    private var otpForm: some View {
        VStack(spacing: 30) {
            Text(I18nService.shared.t("auth.otp.subtitle"))
                .font(.callout)
                .foregroundStyle(.secondary)
                .multilineTextAlignment(.center)

            TextField("000000", text: $otpCode)
                .textFieldStyle(.automatic)
                .multilineTextAlignment(.center)

            Button(action: verifyOtp) {
                if authService.isLoading {
                    ProgressView()
                } else {
                    Text(I18nService.shared.t("auth.otp.verify"))
                        .frame(maxWidth: .infinity)
                }
            }
            .disabled(otpCode.isEmpty || authService.isLoading)

            Button(I18nService.shared.t("auth.otp.back")) {
                otpRequired = false
                tempToken = ""
                otpCode = ""
                authService.errorMessage = nil
            }
        }
        .frame(maxWidth: 500)
    }

    // MARK: - Actions

    private func login() {
        Task {
            do {
                try await authService.login(username: username, password: password)
            } catch let error as OtpRequiredError {
                otpRequired = true
                tempToken = error.tempToken
                otpCode = ""
            } catch {
                // Handled by authService state
            }
        }
    }

    private func verifyOtp() {
        Task {
            await authService.verifyOtp(tempToken: tempToken, code: otpCode)
        }
    }
}

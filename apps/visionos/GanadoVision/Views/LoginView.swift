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
        VStack(spacing: 32) {
            Spacer()

            // ── Logo & header ──
            VStack(spacing: 12) {
                ZStack {
                    Circle()
                        .fill(primaryGreen)
                        .frame(width: 72, height: 72)
                    Image(systemName: "pawprint.fill")
                        .font(.system(size: 36))
                        .foregroundStyle(.white)
                }

                Text(I18nService.shared.t("app.name"))
                    .font(.largeTitle)
                    .fontWeight(.heavy)
                    .foregroundStyle(primaryDark)

                Text(otpRequired
                     ? I18nService.shared.t("auth.otp.title")
                     : I18nService.shared.t("auth.loginSubtitle"))
                    .font(.title3)
                    .foregroundStyle(.secondary)
            }

            // ── Error display ──
            if let error = authService.errorMessage {
                HStack(spacing: 8) {
                    Image(systemName: "exclamationmark.triangle.fill")
                        .foregroundStyle(.red)
                    Text(error)
                        .font(.callout)
                        .foregroundStyle(.red)
                }
                .padding(12)
                .background(Color.red.opacity(0.1))
                .clipShape(RoundedRectangle(cornerRadius: 8))
            }

            // ── OTP form or login form ──
            if otpRequired {
                otpForm
            } else {
                loginForm
            }

            Spacer()
        }
        .padding(40)
    }

    // MARK: - Login form

    private var loginForm: some View {
        VStack(spacing: 16) {
            VStack(alignment: .leading, spacing: 6) {
                Text(I18nService.shared.t("auth.username"))
                    .font(.caption.weight(.semibold))
                    .foregroundStyle(.secondary)
                TextField(I18nService.shared.t("auth.usernamePlaceholder"), text: $username)
                    .textFieldStyle(.roundedBorder)
                    .textContentType(.username)
                    .autocorrectionDisabled()
            }

            VStack(alignment: .leading, spacing: 6) {
                Text(I18nService.shared.t("auth.password"))
                    .font(.caption.weight(.semibold))
                    .foregroundStyle(.secondary)
                SecureField(I18nService.shared.t("auth.passwordPlaceholder"), text: $password)
                    .textFieldStyle(.roundedBorder)
                    .textContentType(.password)
            }

            Button(action: login) {
                Group {
                    if authService.isLoading {
                        ProgressView()
                            .tint(.white)
                    } else {
                        Text(I18nService.shared.t("auth.login"))
                            .fontWeight(.semibold)
                    }
                }
                .frame(maxWidth: .infinity)
                .frame(height: 44)
            }
            .buttonStyle(.borderedProminent)
            .tint(primaryGreen)
            .disabled(username.isEmpty || password.isEmpty || authService.isLoading)
        }
        .frame(maxWidth: 360)
    }

    // MARK: - OTP form

    private var otpForm: some View {
        VStack(spacing: 16) {
            Text(I18nService.shared.t("auth.otp.subtitle"))
                .font(.callout)
                .foregroundStyle(.secondary)
                .multilineTextAlignment(.center)
                .padding(12)
                .background(primaryGreen.opacity(0.1))
                .clipShape(RoundedRectangle(cornerRadius: 8))

            VStack(alignment: .leading, spacing: 6) {
                Text(I18nService.shared.t("auth.otp.code"))
                    .font(.caption.weight(.semibold))
                    .foregroundStyle(.secondary)
                TextField("000000", text: $otpCode)
                    .textFieldStyle(.roundedBorder)
                    .multilineTextAlignment(.center)
                    .font(.title2.monospaced())
            }

            Button(action: verifyOtp) {
                Group {
                    if authService.isLoading {
                        ProgressView()
                            .tint(.white)
                    } else {
                        Text(I18nService.shared.t("auth.otp.verify"))
                            .fontWeight(.semibold)
                    }
                }
                .frame(maxWidth: .infinity)
                .frame(height: 44)
            }
            .buttonStyle(.borderedProminent)
            .tint(primaryGreen)
            .disabled(otpCode.isEmpty || authService.isLoading)

            Button(I18nService.shared.t("auth.otp.back")) {
                otpRequired = false
                tempToken = ""
                otpCode = ""
                authService.errorMessage = nil
            }
            .buttonStyle(.borderless)
        }
        .frame(maxWidth: 360)
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

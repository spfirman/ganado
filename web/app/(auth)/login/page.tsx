"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../lib/auth-context";
import { OtpRequiredError } from "../../lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const { login, loginWithOtp } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Estado OTP
  const [otpRequired, setOtpRequired] = useState(false);
  const [tempToken, setTempToken] = useState("");
  const [otpCode, setOtpCode] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await login(username, password);
      router.push("/dashboard");
    } catch (err) {
      if (err instanceof OtpRequiredError) {
        setOtpRequired(true);
        setTempToken(err.tempToken);
      } else if (err instanceof Error) {
        setError(err.message || "Error al iniciar sesión. Intenta de nuevo.");
      } else {
        setError("Ocurrió un error inesperado.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function handleOtpSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await loginWithOtp(tempToken, otpCode);
      router.push("/dashboard");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "Código OTP inválido.");
      } else {
        setError("Ocurrió un error inesperado.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  function handleBackToLogin() {
    setOtpRequired(false);
    setTempToken("");
    setOtpCode("");
    setError(null);
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.iconCircle}>
            <svg
              style={styles.icon}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 10C3 10 5 6 9 6C10.5 6 11.5 6.5 12 7C12.5 6.5 13.5 6 15 6C19 6 21 10 21 10L20 11C20 11 21 14 21 16C21 18 19 20 17 20C15.5 20 14.5 19 14 18H10C9.5 19 8.5 20 7 20C5 20 3 18 3 16C3 14 4 11 4 11L3 10Z"
                fill="white"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="8.5" cy="12" r="1" fill="#2E7D32" />
              <circle cx="15.5" cy="12" r="1" fill="#2E7D32" />
            </svg>
          </div>
          <h1 style={styles.title}>Ganado</h1>
          <p style={styles.subtitle}>
            {otpRequired
              ? "Ingresa el código de tu app autenticadora"
              : "Inicia sesión en tu cuenta"}
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={styles.error} role="alert">
            {error}
          </div>
        )}

        {/* OTP Form */}
        {otpRequired ? (
          <form onSubmit={handleOtpSubmit} style={styles.form}>
            <div style={styles.otpInfo}>
              Se requiere autenticación de dos factores. Ingresa el código de 6 dígitos
              de tu aplicación autenticadora o un código de respaldo.
            </div>

            <div style={styles.fieldGroup}>
              <label htmlFor="otpCode" style={styles.label}>
                Código de verificación
              </label>
              <input
                id="otpCode"
                type="text"
                required
                autoComplete="one-time-code"
                autoFocus
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                style={{ ...styles.input, textAlign: "center" as const, fontSize: "1.25rem", letterSpacing: "0.3em" }}
                placeholder="000000"
                maxLength={8}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              style={{
                ...styles.button,
                ...(submitting ? styles.buttonDisabled : {}),
              }}
            >
              {submitting ? "Verificando..." : "Verificar"}
            </button>

            <button
              type="button"
              onClick={handleBackToLogin}
              style={styles.backButton}
            >
              Volver al inicio de sesión
            </button>
          </form>
        ) : (
          <>
            {/* Login Form */}
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.fieldGroup}>
                <label htmlFor="username" style={styles.label}>
                  Usuario
                </label>
                <input
                  id="username"
                  type="text"
                  required
                  autoComplete="username"
                  autoFocus
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={styles.input}
                  placeholder="Ingresa tu usuario"
                />
              </div>

              <div style={styles.fieldGroup}>
                <label htmlFor="password" style={styles.label}>
                  Contraseña
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={styles.input}
                  placeholder="Ingresa tu contraseña"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                style={{
                  ...styles.button,
                  ...(submitting ? styles.buttonDisabled : {}),
                }}
              >
                {submitting ? "Iniciando sesión..." : "Iniciar sesión"}
              </button>
            </form>

            <div style={{ textAlign: "center", marginTop: "1rem" }}>
              <a href="/forgot-password" style={styles.forgotLink}>
                ¿Olvidaste tu contraseña?
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Inline styles
// ---------------------------------------------------------------------------

const PRIMARY = "#2E7D32";
const PRIMARY_DARK = "#1B5E20";

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    padding: "1rem",
    background: "linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)",
  },
  card: {
    width: "100%",
    maxWidth: 400,
    background: "#fff",
    borderRadius: 12,
    padding: "2.5rem 2rem 2rem",
    boxShadow:
      "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)",
  },
  header: {
    textAlign: "center" as const,
    marginBottom: "1.5rem",
  },
  iconCircle: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 56,
    height: 56,
    borderRadius: "50%",
    background: PRIMARY,
    marginBottom: "0.75rem",
  },
  icon: {
    width: 32,
    height: 32,
  },
  title: {
    margin: 0,
    fontSize: "1.75rem",
    fontWeight: 700,
    color: PRIMARY_DARK,
    letterSpacing: "-0.02em",
  },
  subtitle: {
    margin: "0.25rem 0 0",
    fontSize: "0.875rem",
    color: "#6B7280",
  },
  error: {
    background: "#FEF2F2",
    border: "1px solid #FECACA",
    color: "#991B1B",
    borderRadius: 8,
    padding: "0.75rem 1rem",
    fontSize: "0.875rem",
    marginBottom: "1rem",
  },
  otpInfo: {
    background: "#F0FDF4",
    border: "1px solid #BBF7D0",
    color: "#166534",
    borderRadius: 8,
    padding: "0.75rem 1rem",
    fontSize: "0.8125rem",
    lineHeight: "1.5",
  },
  form: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "1.25rem",
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "0.375rem",
  },
  label: {
    fontSize: "0.875rem",
    fontWeight: 500,
    color: "#374151",
  },
  input: {
    padding: "0.625rem 0.75rem",
    fontSize: "0.9375rem",
    border: "1px solid #D1D5DB",
    borderRadius: 8,
    outline: "none",
    transition: "border-color 0.15s, box-shadow 0.15s",
    width: "100%",
    boxSizing: "border-box" as const,
  },
  button: {
    padding: "0.75rem",
    fontSize: "0.9375rem",
    fontWeight: 600,
    color: "#fff",
    background: PRIMARY,
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    transition: "background 0.15s",
    marginTop: "0.25rem",
  },
  buttonDisabled: {
    opacity: 0.6,
    cursor: "not-allowed",
  },
  backButton: {
    padding: "0.625rem",
    fontSize: "0.875rem",
    fontWeight: 500,
    color: "#6B7280",
    background: "transparent",
    border: "1px solid #D1D5DB",
    borderRadius: 8,
    cursor: "pointer",
  },
  forgotLink: {
    color: PRIMARY,
    fontSize: "0.875rem",
    textDecoration: "none",
  },
};

"use client";

import { FormEvent, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { apiFetch } from "../lib/api";

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function validatePassword(pw: string): string | null {
    if (pw.length < 8) return "La contraseña debe tener al menos 8 caracteres.";
    if (!/[a-z]/.test(pw))
      return "La contraseña debe contener al menos una letra minúscula.";
    if (!/[A-Z]/.test(pw))
      return "La contraseña debe contener al menos una letra mayúscula.";
    if (!/\d/.test(pw))
      return "La contraseña debe contener al menos un número.";
    return null;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError("Enlace de restablecimiento inválido. Solicita uno nuevo.");
      return;
    }

    const validationError = validatePassword(password);
    if (validationError) {
      setError(validationError);
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setSubmitting(true);
    try {
      await apiFetch("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, password }),
      });
      setSuccess(true);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "Error al restablecer la contraseña.");
      } else {
        setError("Ocurrió un error inesperado.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div style={styles.wrapper}>
        <div style={styles.card}>
          <div style={styles.header}>
            <h1 style={styles.title}>Ganado</h1>
          </div>
          <div style={styles.success}>
            <p style={{ margin: 0, fontWeight: 600 }}>
              Contraseña restablecida
            </p>
            <p style={{ margin: "0.5rem 0 0", fontSize: "0.875rem" }}>
              Tu contraseña ha sido actualizada exitosamente.
            </p>
          </div>
          <button
            onClick={() => router.push("/login")}
            style={styles.button}
          >
            Iniciar sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>Ganado</h1>
          <p style={styles.subtitle}>Restablecer contraseña</p>
        </div>

        {error && (
          <div style={styles.error} role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.fieldGroup}>
            <label htmlFor="password" style={styles.label}>
              Nueva contraseña
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              placeholder="Mínimo 8 caracteres"
            />
          </div>

          <div style={styles.fieldGroup}>
            <label htmlFor="confirmPassword" style={styles.label}>
              Confirmar contraseña
            </label>
            <input
              id="confirmPassword"
              type="password"
              required
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={styles.input}
              placeholder="Repite tu contraseña"
            />
          </div>

          <p style={styles.hint}>
            Debe tener al menos 8 caracteres, una mayúscula, una minúscula y un
            número.
          </p>

          <button
            type="submit"
            disabled={submitting}
            style={{
              ...styles.button,
              ...(submitting ? styles.buttonDisabled : {}),
            }}
          >
            {submitting ? "Restableciendo..." : "Restablecer contraseña"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "1rem" }}>
          <a href="/login" style={styles.link}>
            Volver al inicio de sesión
          </a>
        </div>
      </div>
    </div>
  );
}

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
  success: {
    background: "#F0FDF4",
    border: "1px solid #BBF7D0",
    color: "#166534",
    borderRadius: 8,
    padding: "0.75rem 1rem",
    fontSize: "0.875rem",
    marginBottom: "1rem",
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
  hint: {
    margin: 0,
    fontSize: "0.75rem",
    color: "#9CA3AF",
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
    width: "100%",
  },
  buttonDisabled: {
    opacity: 0.6,
    cursor: "not-allowed",
  },
  link: {
    color: PRIMARY,
    fontSize: "0.875rem",
    textDecoration: "none",
  },
};

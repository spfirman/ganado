"use client";

import { FormEvent, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { apiFetch } from "../lib/api";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

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
      <div className="flex items-center justify-center min-h-screen p-4 bg-primary-light/30">
        <div className="w-full bg-surface-alt rounded-lg shadow-lg p-10" style={{ maxWidth: 400 }}>
          <div className="text-center mb-6">
            <h1 className="font-heading text-3xl font-bold text-primary-dark m-0 tracking-tight">Ganado</h1>
          </div>
          <div className="bg-success/10 border border-success/30 text-success rounded-lg px-4 py-3 text-sm mb-4">
            <p className="m-0 font-semibold">Contraseña restablecida</p>
            <p className="mt-2 mb-0 text-sm">Tu contraseña ha sido actualizada exitosamente.</p>
          </div>
          <Button onClick={() => router.push("/login")} size="lg" className="w-full">
            Iniciar sesión
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-primary-light/30">
      <div className="w-full bg-surface-alt rounded-lg shadow-lg p-10" style={{ maxWidth: 400 }}>
        <div className="text-center mb-6">
          <h1 className="font-heading text-3xl font-bold text-primary-dark m-0 tracking-tight">Ganado</h1>
          <p className="text-on-surface-muted text-sm mt-1 mb-0">Restablecer contraseña</p>
        </div>

        {error && (
          <div className="bg-error/10 border border-error/30 text-error rounded-lg px-4 py-3 text-sm mb-4" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Input
            label="Nueva contraseña"
            id="password"
            type="password"
            required
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mínimo 8 caracteres"
          />

          <Input
            label="Confirmar contraseña"
            id="confirmPassword"
            type="password"
            required
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repite tu contraseña"
          />

          <p className="text-xs text-on-surface-muted m-0">
            Debe tener al menos 8 caracteres, una mayúscula, una minúscula y un
            número.
          </p>

          <Button type="submit" disabled={submitting} size="lg" className="w-full mt-1">
            {submitting ? "Restableciendo..." : "Restablecer contraseña"}
          </Button>
        </form>

        <div className="text-center mt-4">
          <a href="/login" className="text-primary text-sm no-underline hover:underline">
            Volver al inicio de sesión
          </a>
        </div>
      </div>
    </div>
  );
}

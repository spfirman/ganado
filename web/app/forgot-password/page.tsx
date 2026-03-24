"use client";

import { FormEvent, useState } from "react";
import { apiFetch } from "../lib/api";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await apiFetch("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      setSent(true);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "Error al procesar la solicitud.");
      } else {
        setError("Ocurrió un error inesperado.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 bg-primary-light/30">
        <div className="w-full bg-surface-alt rounded-lg shadow-lg p-10" style={{ maxWidth: 400 }}>
          <div className="text-center mb-6">
            <h1 className="font-heading text-3xl font-bold text-primary-dark m-0 tracking-tight">Ganado</h1>
          </div>
          <div className="bg-success/10 border border-success/30 text-success rounded-lg px-4 py-3 text-sm mb-4">
            <p className="m-0 font-semibold">Revisa tu correo</p>
            <p className="mt-2 mb-0 text-sm">
              Si el correo está registrado, recibirás un enlace para restablecer
              tu contraseña.
            </p>
          </div>
          <div className="text-center">
            <a href="/login" className="text-primary text-sm no-underline hover:underline">
              Volver al inicio de sesión
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-primary-light/30">
      <div className="w-full bg-surface-alt rounded-lg shadow-lg p-10" style={{ maxWidth: 400 }}>
        <div className="text-center mb-6">
          <h1 className="font-heading text-3xl font-bold text-primary-dark m-0 tracking-tight">Ganado</h1>
          <p className="text-on-surface-muted text-sm mt-1 mb-0">Recuperar contraseña</p>
        </div>

        <p className="text-on-surface text-sm leading-relaxed mb-4">
          Ingresa tu correo electrónico y te enviaremos un enlace para
          restablecer tu contraseña.
        </p>

        {error && (
          <div className="bg-error/10 border border-error/30 text-error rounded-lg px-4 py-3 text-sm mb-4" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Input
            label="Correo electrónico"
            id="email"
            type="email"
            required
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@correo.com"
          />

          <Button type="submit" disabled={submitting} size="lg" className="w-full mt-1">
            {submitting ? "Enviando..." : "Enviar enlace de recuperación"}
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

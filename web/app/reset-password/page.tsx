"use client";

import { Suspense } from "react";
import ResetPasswordForm from "./ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen p-4 bg-primary-light/30">
          <div className="w-full bg-surface-alt rounded-lg shadow-lg p-10" style={{ maxWidth: 400 }}>
            <p className="text-center text-on-surface-muted">Cargando...</p>
          </div>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}

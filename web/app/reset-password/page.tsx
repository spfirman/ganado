"use client";

import { Suspense } from "react";
import ResetPasswordForm from "./ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div style={styles.wrapper}>
          <div style={styles.card}>
            <p style={{ textAlign: "center", color: "#6B7280" }}>Cargando...</p>
          </div>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}

const PRIMARY = "#2E7D32";

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
};

"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../lib/auth-context";
import { OtpRequiredError } from "../../lib/auth";
import { useI18n } from "../../lib/i18n";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

export default function LoginPage() {
  const router = useRouter();
  const { login, loginWithOtp } = useAuth();
  const { t } = useI18n();

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
        setError(err.message || t("errors.loginFailed"));
      } else {
        setError(t("errors.loginFailed"));
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
        setError(err.message || t("errors.otpInvalid"));
      } else {
        setError(t("errors.otpInvalid"));
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
    <div className="flex items-center justify-center min-h-screen p-4 bg-primary-light/30">
      <div className="w-full bg-surface-alt rounded-lg shadow-lg p-10" style={{ maxWidth: 400 }}>
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary mb-3">
            <svg
              className="w-8 h-8"
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
              <circle cx="8.5" cy="12" r="1" fill="var(--color-primary-dark)" />
              <circle cx="15.5" cy="12" r="1" fill="var(--color-primary-dark)" />
            </svg>
          </div>
          <h1 className="font-heading text-3xl font-bold text-primary-dark m-0 tracking-tight">
            {t("app.name")}
          </h1>
          <p className="text-on-surface-muted text-sm mt-1 mb-0">
            {otpRequired ? t("auth.otp.title") : t("auth.loginSubtitle")}
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-error/10 border border-error/30 text-error rounded-lg px-4 py-3 text-sm mb-4" role="alert">
            {error}
          </div>
        )}

        {/* OTP Form */}
        {otpRequired ? (
          <form onSubmit={handleOtpSubmit} className="flex flex-col gap-5">
            <div className="bg-success/10 border border-success/30 text-success rounded-lg px-4 py-3 text-[0.8125rem] leading-relaxed">
              {t("auth.otp.subtitle")}
            </div>

            <Input
              label={t("auth.otp.code")}
              id="otpCode"
              type="text"
              required
              autoComplete="one-time-code"
              autoFocus
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              placeholder="000000"
              maxLength={8}
              className="[&_input]:text-center [&_input]:text-xl [&_input]:tracking-widest"
            />

            <Button type="submit" disabled={submitting} size="lg" className="w-full mt-1">
              {submitting ? t("common.loading") : t("auth.otp.verify")}
            </Button>

            <Button type="button" variant="ghost" onClick={handleBackToLogin} className="w-full">
              {t("auth.otp.back")}
            </Button>
          </form>
        ) : (
          <>
            {/* Login Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <Input
                label={t("auth.username")}
                id="username"
                type="text"
                required
                autoComplete="username"
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={t("auth.usernamePlaceholder")}
              />

              <Input
                label={t("auth.password")}
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t("auth.passwordPlaceholder")}
              />

              <Button type="submit" disabled={submitting} size="lg" className="w-full mt-1">
                {submitting ? t("auth.signingIn") : t("auth.login")}
              </Button>
            </form>

            <div className="text-center mt-4">
              <a href="/forgot-password" className="text-primary text-sm no-underline hover:underline">
                {t("auth.forgotPassword")}
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

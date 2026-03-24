import { apiFetch } from "./api";

// ---------------------------------------------------------------------------
// Storage keys
// ---------------------------------------------------------------------------

const TOKEN_KEY = "ganado_access_token";
const REFRESH_TOKEN_KEY = "ganado_refresh_token";
const USER_KEY = "ganado_user";

// ---------------------------------------------------------------------------
// Token helpers
// ---------------------------------------------------------------------------

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

// ---------------------------------------------------------------------------
// Refresh token helpers
// ---------------------------------------------------------------------------

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setRefreshToken(token: string): void {
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
}

// ---------------------------------------------------------------------------
// User helpers
// ---------------------------------------------------------------------------

export interface User {
  id: number;
  username: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  role?: string;
  [key: string]: unknown;
}

export function getUser(): User | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function setUser(user: User): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

// ---------------------------------------------------------------------------
// Auth checks
// ---------------------------------------------------------------------------

export function isAuthenticated(): boolean {
  return getToken() !== null;
}

// ---------------------------------------------------------------------------
// Login / Logout
// ---------------------------------------------------------------------------

interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

interface OtpRequiredResponse {
  requiresOtp: true;
  tempToken: string;
  message: string;
}

export type LoginResult =
  | { requiresOtp: false; user: User }
  | { requiresOtp: true; tempToken: string };

export async function login(
  username: string,
  password: string,
): Promise<User> {
  const data = await apiFetch<LoginResponse | OtpRequiredResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      company_username: "gpcb_ranch",
      username,
      password,
    }),
  });

  // Si requiere OTP, lanzar error especial con tempToken
  if ("requiresOtp" in data && data.requiresOtp) {
    const err = new OtpRequiredError(data.tempToken);
    throw err;
  }

  const loginData = data as LoginResponse;
  setToken(loginData.access_token);
  setRefreshToken(loginData.refresh_token);
  setUser(loginData.user);

  return loginData.user;
}

/**
 * Completa el login enviando el código OTP con el token temporal.
 */
export async function loginWithOtp(tempToken: string, code: string): Promise<User> {
  const data = await apiFetch<LoginResponse>("/auth/login/otp", {
    method: "POST",
    body: JSON.stringify({ tempToken, code }),
  });

  setToken(data.access_token);
  setRefreshToken(data.refresh_token);
  setUser(data.user);

  return data.user;
}

export async function logout(): Promise<void> {
  try {
    await apiFetch("/auth/logout", { method: "POST" });
  } catch {
    // Swallow errors — we clear local state regardless.
  } finally {
    clearToken();
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
}

// ---------------------------------------------------------------------------
// OTP Required Error
// ---------------------------------------------------------------------------

export class OtpRequiredError extends Error {
  tempToken: string;

  constructor(tempToken: string) {
    super("Se requiere código de autenticación de dos factores.");
    this.name = "OtpRequiredError";
    this.tempToken = tempToken;
  }
}

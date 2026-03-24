"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import type { User } from "./auth";
import {
  getToken,
  getUser as getStoredUser,
  login as authLogin,
  loginWithOtp as authLoginWithOtp,
  logout as authLogout,
} from "./auth";

// ---------------------------------------------------------------------------
// Context shape
// ---------------------------------------------------------------------------

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<User>;
  loginWithOtp: (tempToken: string, code: string) => Promise<User>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const token = getToken();
    if (token) {
      const storedUser = getStoredUser();
      if (storedUser) {
        setUser(storedUser);
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const loggedInUser = await authLogin(username, password);
    setUser(loggedInUser);
    return loggedInUser;
  }, []);

  const loginWithOtp = useCallback(async (tempToken: string, code: string) => {
    const loggedInUser = await authLoginWithOtp(tempToken, code);
    setUser(loggedInUser);
    return loggedInUser;
  }, []);

  const logout = useCallback(async () => {
    await authLogout();
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, loading, login, loginWithOtp, logout }),
    [user, loading, login, loginWithOtp, logout],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}

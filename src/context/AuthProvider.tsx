"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  AUTH_STORAGE_KEY,
  DEMO_USERS,
  findDemoUser,
  ROLE_HOME,
  type AuthUser,
  type UserRole,
} from "@/src/lib/auth";

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => { ok: true; user: AuthUser } | { ok: false; error: string };
  loginAs: (role: UserRole) => AuthUser;
  logout: () => void;
  homePath: string;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(AUTH_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as AuthUser;
        if (parsed?.role === "bank" || parsed?.role === "customer" || parsed?.role === "employer") {
          setUser(parsed);
        }
      }
    } catch {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } finally {
      setLoading(false);
    }
  }, []);

  const persist = useCallback((next: AuthUser | null) => {
    setUser(next);
    if (next) localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(next));
    else localStorage.removeItem(AUTH_STORAGE_KEY);
  }, []);

  const login = useCallback(
    (email: string, password: string) => {
      void password;
      const found = findDemoUser(email);
      if (!found) {
        return { ok: false as const, error: "تعذّر العثور على الحساب. استخدم أحد الحسابات التجريبية: بنك، عميل، أو جهة عمل." };
      }
      persist(found);
      return { ok: true as const, user: found };
    },
    [persist]
  );

  const loginAs = useCallback(
    (role: UserRole) => {
      const demo = DEMO_USERS.find((u) => u.role === role)!;
      persist(demo);
      return demo;
    },
    [persist]
  );

  const logout = useCallback(() => persist(null), [persist]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      login,
      loginAs,
      logout,
      homePath: user ? ROLE_HOME[user.role] : "/login",
    }),
    [user, loading, login, loginAs, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

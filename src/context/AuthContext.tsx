/**
 * AuthContext.tsx
 *
 * Single source of truth for authentication state.
 * Exposes: user, token, isLoading, login, logout.
 *
 * Architecture note: We keep login/logout logic in the context (not in components)
 * so the same auth flow is reusable across any page without coupling to UI.
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getMe, verifyOtp } from "../services/authService";
import type { User } from "../types";
import { storage } from "../utils/storage";

// ─── Context Shape ────────────────────────────────────────────────────────────

interface AuthContextValue {
  user: User | null;
  token: string | null;
  /** True while the initial session bootstrap is running */
  isBootstrapping: boolean;
  isAuthenticated: boolean;
  /** Verify OTP and persist session */
  login: (contact: string, otp: string) => Promise<void>;
  logout: () => void;
  /** Update the current user profile in state + localStorage */
  updateUser: (updates: Partial<Pick<User, "name" | "email" | "phone">>) => void;
}

// ─── Context Creation ─────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// ─── Provider ─────────────────────────────────────────────────────────────────

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  // ── Bootstrap: restore session from localStorage on app load ─────────────
  useEffect(() => {
    const restoreSession = async () => {
      const savedToken = storage.getToken();
      const savedUser = storage.getUser<User>();

      if (savedToken && savedUser) {
        try {
          // Re-validate token against "backend" to catch expiry
          const freshUser = await getMe(savedToken);
          setUser(freshUser);
          setToken(savedToken);
        } catch {
          // Token invalid — clear stale session silently
          storage.clear();
        }
      }
      setIsBootstrapping(false);
    };

    restoreSession();
  }, []);

  // ── login: called after OTP screen collects the code ─────────────────────
  const login = useCallback(async (contact: string, otp: string) => {
    const { user: authUser, token: authToken } = await verifyOtp({
      contact,
      otp,
    });
    storage.setToken(authToken);
    storage.setUser(authUser);
    setToken(authToken);
    setUser(authUser);
  }, []);

  // ── logout ────────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    storage.clear();
    setUser(null);
    setToken(null);
  }, []);

  // ── updateUser: patch name/email/phone in state + localStorage ───────────
  const updateUser = useCallback(
    (updates: Partial<Pick<User, "name" | "email" | "phone">>) => {
      setUser((prev) => {
        if (!prev) return prev;
        const next = { ...prev, ...updates };
        storage.setUser(next);
        return next;
      });
    },
    []
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isBootstrapping,
      isAuthenticated: !!user && !!token,
      login,
      logout,
      updateUser,
    }),
    [user, token, isBootstrapping, login, logout, updateUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return ctx;
};

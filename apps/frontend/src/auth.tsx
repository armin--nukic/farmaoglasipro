import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { ApiResponse } from "@farma/shared";
import { api } from "./lib/api";

interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: string;
}

interface AuthPayload {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: { email: string; password: string; fullName: string; phone?: string }) => Promise<void>;
  googleLogin: (idToken: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function readUser() {
  const raw = localStorage.getItem("farma:user");
  return raw ? JSON.parse(raw) as AuthUser : null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => readUser());
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("farma:token"));

  function persist(payload: AuthPayload) {
    localStorage.setItem("farma:token", payload.accessToken);
    localStorage.setItem("farma:refresh", payload.refreshToken);
    localStorage.setItem("farma:user", JSON.stringify(payload.user));
    setToken(payload.accessToken);
    setUser(payload.user);
  }

  const value = useMemo<AuthContextValue>(() => ({
    user,
    token,
    login: async (email, password) => {
      const response = await api<ApiResponse<AuthPayload>>("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
      persist(response.data);
    },
    register: async (payload) => {
      const response = await api<ApiResponse<AuthPayload>>("/auth/register", { method: "POST", body: JSON.stringify(payload) });
      persist(response.data);
    },
    googleLogin: async (idToken) => {
      const response = await api<ApiResponse<AuthPayload>>("/auth/google", { method: "POST", body: JSON.stringify({ idToken }) });
      persist(response.data);
    },
    logout: () => {
      localStorage.removeItem("farma:token");
      localStorage.removeItem("farma:refresh");
      localStorage.removeItem("farma:user");
      setToken(null);
      setUser(null);
    }
  }), [token, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider");
  return value;
}

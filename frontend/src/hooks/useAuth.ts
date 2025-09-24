import { useEffect, useState } from "react";
import {
  clearToken,
  login as apiLogin,
  me,
  register as apiRegister,
} from "@/services/api";

type User = { id: number; username: string; role: "user" | "admin" } | null;

export function useAuth() {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const u = await me();
      setUser(u as any);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const login = async (username: string, password: string) => {
    await apiLogin(username, password);
    await load();
  };

  const register = async (username: string, password: string) => {
    await apiRegister(username, password);
  };

  const logout = () => {
    clearToken();
    setUser(null);
  };

  return { user, loading, login, register, logout };
}


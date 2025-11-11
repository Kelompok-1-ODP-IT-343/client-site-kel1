"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { deleteCookie, getCookie } from "@/app/lib/cookie";

type User = {
id: number | string;
  fullName: string;
  photoUrl?: string;
};

type AuthContextType = {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Sinkronkan state user dengan keberadaan cookie token
    const token = getCookie("token");
    if (!token) {
      // Jika token tidak ada, pastikan user dihapus agar menu profil tidak tampil
      setUser(null);
      localStorage.removeItem("user");
    } else {
      const savedUser = localStorage.getItem("user");
      if (savedUser) setUser(JSON.parse(savedUser));
    }

    // Perbarui saat jendela mendapatkan fokus (mis. setelah logout di tab lain)
    const syncOnFocus = () => {
      const t = getCookie("token");
      if (!t) {
        setUser(null);
        localStorage.removeItem("user");
      }
    };
    window.addEventListener("focus", syncOnFocus);
    return () => window.removeEventListener("focus", syncOnFocus);
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    deleteCookie("token");
    deleteCookie("token_type");
    deleteCookie("refreshToken");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth harus digunakan di dalam <AuthProvider>");
  return ctx;
}

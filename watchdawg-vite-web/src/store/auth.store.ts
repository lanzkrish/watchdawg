/** @format */

import { disconnectSocket } from "@/lib/socket"; // ✅ unified
import { create } from "zustand";

/* ============================== */
/* 🧾 TYPES                       */
/* ============================== */

export type Role = "admin" | "employee" | "superadmin";

export interface User {
  id: string;
  name: string;
  role: Role;
  organizationId: string;
}

interface AuthState {
  token: string | null;
  user: User | null;

  isAuthenticated: boolean;
  isHydrated: boolean;

  /* 🔥 DERIVED */
  orgId: string | null;

  /* 🔧 ACTIONS */
  setAuth: (token: string, user: User) => void;
  hydrate: () => void;
  logout: () => void;
}

/* ============================== */
/* 🧠 SAFE PARSER                 */
/* ============================== */

function safeParseUser(): User | null {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return null;

    const parsed = JSON.parse(raw);

    if (
      typeof parsed.id === "string" &&
      typeof parsed.organizationId === "string"
    ) {
      return parsed;
    }

    return null;
  } catch {
    console.warn("⚠️ Invalid user JSON");
    return null;
  }
}

/* ============================== */
/* 🚀 STORE                       */
/* ============================== */

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  orgId: null,

  isAuthenticated: false,
  isHydrated: false,

  /* ============================== */
  /* 🔐 SET AUTH                    */
  /* ============================== */

  setAuth: (token, user) => {
    if (!token || !user?.id || !user.organizationId) {
      console.error("❌ Invalid auth payload");
      return;
    }

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    set({
      token,
      user,
      orgId: user.organizationId,
      isAuthenticated: true,
      isHydrated: true,
    });

    console.log("🔐 Auth stored:", user.id);
  },

  /* ============================== */
  /* 🔄 HYDRATE                    */
  /* ============================== */

  hydrate: () => {
    const token = localStorage.getItem("token");
    const user = safeParseUser();

    if (token && user) {
      set({
        token,
        user,
        orgId: user.organizationId,
        isAuthenticated: true,
        isHydrated: true,
      });

      console.log("🔄 Auth restored:", user.id);
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      set({
        token: null,
        user: null,
        orgId: null,
        isAuthenticated: false,
        isHydrated: true,
      });

      console.log("⚠️ No valid session");
    }
  },

  /* ============================== */
  /* 🚪 LOGOUT                      */
  /* ============================== */

  logout: () => {
    console.log("🚪 Logging out...");

    /* 🔥 CRITICAL: FULL SOCKET CLEANUP */
    disconnectSocket(); // ✅ unified disconnect

    /* 🔥 CLEAR STORAGE */
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    set({
      token: null,
      user: null,
      orgId: null,
      isAuthenticated: false,
      isHydrated: true,
    });

    console.log("✅ Logout complete");
  },
}));

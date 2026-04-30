/** @format */

import { loginUser } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";

/* ============================== */
/* 🔐 AUTH HOOK                   */
/* ============================== */

export const useAuth = () => {
  const { setAuth, logout: clearStore } = useAuthStore();

  /* ============================== */
  /* 🔑 LOGIN                       */
  /* ============================== */

  const login = async (email: string, password: string) => {
    try {
      const res = await loginUser(email, password);

      console.log("✅ LOGIN SUCCESS:", res);

      /* 🔥 CORRECT VALIDATION */
      if (!res?.token || !res?.user) {
        throw new Error("Invalid login response");
      }

      /* 🔥 STORE IN ZUSTAND */
      setAuth(res.token, res.user);

      /* 🔥 PERSIST (SYNC WITH STORE) */
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
      localStorage.setItem("role", res.user.role);

      return res;
    } catch (error: any) {
      console.error(
        "❌ LOGIN ERROR:",
        error?.response?.data || error.message
      );

      throw error?.response?.data || error;
    }
  };

  /* ============================== */
  /* 🚪 LOGOUT                      */
  /* ============================== */

  const logout = () => {
    try {
      clearStore(); // Zustand reset

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("role");

      console.log("🚪 Logged out");
    } catch (err) {
      console.error("❌ Logout error:", err);
    }
  };

  /* ============================== */
  /* 🔄 RESTORE SESSION             */
  /* ============================== */

  const restoreSession = () => {
    try {
      const token = localStorage.getItem("token");
      const userRaw = localStorage.getItem("user");

      if (!token || !userRaw) return;

      const user = JSON.parse(userRaw);

      /* 🔥 SAFETY CHECK */
      if (!user?.id || !user?.role) {
        console.warn("⚠️ Invalid stored user");
        logout();
        return;
      }

      setAuth(token, user);

      console.log("🔐 Session restored:", user.id);
    } catch (err) {
      console.error("❌ Restore session error:", err);
      logout();
    }
  };

  return {
    login,
    logout,
    restoreSession,
  };
};

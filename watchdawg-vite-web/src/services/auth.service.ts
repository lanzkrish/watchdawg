/** @format */

import { api } from "./api";

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

export interface LoginResponse {
  token: string; // ✅ FIXED
  user: User;
}

/* ============================== */
/* 🔑 LOGIN (WEB)                 */
/* ============================== */

export const loginUser = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  try {
    const res = await api.post("/auth/login", {
      email,
      password,
    });

    const data = res.data;

    /* 🔥 SAFETY CHECK (VERY IMPORTANT) */
    if (!data?.token || !data?.user) {
      throw new Error("Invalid login response from server");
    }

    return data;
  } catch (err: any) {
    console.error("❌ Web login error:", err?.response?.data || err.message);

    throw err?.response?.data || {
      message: "Login failed",
    };
  }
};

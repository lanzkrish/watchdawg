/** @format */

import axios from "axios";
import { CONFIG } from "../config/config";
import { logger } from "../utils/logger";
import { saveUser } from "./authStore";

/* ============================== */
/* 🧠 TYPES                       */
/* ============================== */

interface LoginResponse {
  user: {
    id: string;
    email: string;
    organizationId: string;
  };
  token: string;
}

interface AuthData {
  userId: string;
  organizationId: string;
  token: string;
}

/* ============================== */
/* 🔐 LOGIN                       */
/* ============================== */

export async function login(
  email: string,
  password: string
): Promise<AuthData | null> {
  try {
    if (!email || !password) {
      logger.warn("⚠️ Missing credentials");
      return null;
    }

    const res = await axios.post<LoginResponse>(
      `${CONFIG.API.URL}/auth/login`,
      { email, password },
      {
        timeout: 8000,
      }
    );

    const { user, token } = res.data;

    /* ============================== */
    /* 🔒 VALIDATION                  */
    /* ============================== */

    if (!user?.id || !user?.organizationId || !token) {
      logger.error("❌ Invalid login response");
      return null;
    }

    const data: AuthData = {
      userId: user.id,
      organizationId: user.organizationId,
      token,
    };

    /* ============================== */
    /* 💾 SAVE USER (IMPORTANT)       */
    /* ============================== */

    await saveUser(data);

    logger.success("✅ Login successful:", user.email);

    return data;
  } catch (err: any) {
    /* ============================== */
    /* 🧠 SMART ERROR HANDLING        */
    /* ============================== */

    if (err.response) {
      logger.error(
        `❌ Login failed: ${err.response.status} - ${err.response.data?.message || "Unknown"}`
      );
    } else if (err.request) {
      logger.error("❌ Network error (server not reachable)");
    } else {
      logger.error("❌ Unexpected error:", err.message);
    }

    return null;
  }
}

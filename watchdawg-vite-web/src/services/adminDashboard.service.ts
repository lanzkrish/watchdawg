/** @format */

import type { Activity } from "@/types/adminDashboard.types";
import { api } from "./api";

/* ============================== */
/* 📦 API RESPONSE (RAW)          */
/* ============================== */

interface RawDashboardResponse {
  success: boolean;
  data: any[]; // 🔥 raw activities from backend
}

/* ============================== */
/* 🔄 NORMALIZER                  */
/* ============================== */

function normalizeActivity(raw: any): Activity {
  return {
    userId: raw.userId,
    organizationId: raw.organizationId,

    name: raw.name,

    app: raw.app,
    title: raw.title,

    platform: raw.platform,
    category: raw.category,

    status: raw.status,
    duration: raw.duration || 0,

    timestamp: raw.timestamp || Date.now(),

    source: raw.source || "agent",

    background: raw.background || null,
  };
}

/* ============================== */
/* 🚀 MAIN FETCH                  */
/* ============================== */

export const getAdminDashboard = async (
  token: string
): Promise<Activity[]> => {
  try {
    console.log("📡 [API] Fetching Admin Live Activities...");

    const res = await api.get<RawDashboardResponse>(
      "/admin/dashboard",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.data?.success) {
      console.warn("⚠️ API returned unsuccessful response");
      return [];
    }

    const rawActivities = res.data.data || [];

    /* ============================== */
    /* 🔥 NORMALIZE                   */
    /* ============================== */

    const normalized = rawActivities.map(normalizeActivity);

    console.log("✅ [API] Normalized Activities:", {
      count: normalized.length,
    });

    return normalized;

  } catch (err: any) {
    console.error("❌ [API] Admin Dashboard Error:", {
      status: err?.response?.status,
      message: err?.message,
    });

    return []; // 🔥 fallback (don’t crash UI)
  }
};

/** @format */

import type {
  ActivityFeedItem,
  AppUsage,
  EmployeeDashboardData,
  Stats,
  TrendPoint,
} from "@/types/employeeDashboard.types";
import { api } from "./api";

/* ============================== */
/* 📊 DEFAULT SAFE DATA           */
/* ============================== */

const defaultDashboard: EmployeeDashboardData = {
  stats: {
    totalTime: 0,
    productiveTime: 0,
    distractingTime: 0,
    neutralTime: 0,
    productivityScore: 0,
  },
  trend: [],
  apps: [],
  activity: [],
  live: null,
};

/* ============================== */
/* 🧠 NORMALIZERS                 */
/* ============================== */

function normalizeApps(input: unknown): AppUsage[] {
  if (!Array.isArray(input)) return [];

  const safe = input.map((a: any) => ({
    app: String(a?.app || a?.platform || "Unknown"),
    duration: Number(a?.duration ?? a?.totalTime ?? 0),
  }));

  const total = safe.reduce((sum, a) => sum + a.duration, 0);

  return safe.map((a) => ({
    ...a,
    percentage: total ? Math.round((a.duration / total) * 100) : 0,
  }));
}

function normalizeActivity(input: unknown): ActivityFeedItem[] {
  if (!Array.isArray(input)) return [];

  return input.map((a: any, i: number) => ({
    id: String(a?.id || `${a?.userId || "u"}-${i}`),

    userId: String(a?.userId || ""),
    name: a?.name ? String(a.name) : undefined,

    app: String(a?.app || "Unknown"),
    title: a?.title ? String(a.title) : undefined,

    category:
      a?.category === "productive" ||
      a?.category === "distracting"
        ? a.category
        : "neutral",

    status:
      a?.status === "active" ||
      a?.status === "idle"
        ? a.status
        : "away",

    timestamp: a?.time
      ? new Date(a.time).getTime()
      : Date.now(),

    duration: Number(a?.duration ?? 0),
  }));
}

function normalizeTrend(input: unknown): TrendPoint[] {
  if (!Array.isArray(input)) return [];

  return input.map((t: any) => ({
    date: String(t?.date || t?.day || ""),

    productive: Number(t?.productive ?? 0),
    distracting: Number(t?.distracting ?? 0),
    neutral: Number(t?.neutral ?? 0),
  }));
}

function normalizeStats(raw: any): Stats {
  const productive = Number(raw?.productiveTime ?? raw?.focusTime ?? 0);
  const distracting = Number(raw?.distractionTime ?? 0);
  const neutral = Number(raw?.neutralTime ?? 0);

  const total =
    Number(raw?.totalTime ?? 0) ||
    productive + distracting + neutral;

  return {
    totalTime: total,
    productiveTime: productive,
    distractingTime: distracting,
    neutralTime: neutral,
    productivityScore: total
      ? Math.round((productive / total) * 100)
      : 0,
  };
}

/* ============================== */
/* 📊 GET DASHBOARD DATA          */
/* ============================== */

export const getEmployeeDashboard = async (
  options?: { signal?: AbortSignal }
): Promise<EmployeeDashboardData> => {
  try {
    const res = await api.get("/employee/dashboard", {
      signal: options?.signal,
    });

    const data = res?.data ?? {};

    return {
      stats: normalizeStats(data?.stats),
      trend: normalizeTrend(data?.trend),
      apps: normalizeApps(data?.apps),
      activity: normalizeActivity(data?.activity),

      // 🔥 IMPORTANT: DO NOT TRUST RAW LIVE blindly
      live: data?.live
        ? {
            ...data.live,
            app: String(data.live.app || "Unknown"),
            category:
              data.live.category === "productive" ||
              data.live.category === "distracting"
                ? data.live.category
                : "neutral",
            status:
              data.live.status === "active" ||
              data.live.status === "idle"
                ? data.live.status
                : "away",
          }
        : null,
    };
  } catch (error: any) {
    if (error.name === "CanceledError") {
      return defaultDashboard;
    }

    console.error(
      "❌ Dashboard API Error:",
      error?.response?.data || error.message
    );

    return defaultDashboard;
  }
};

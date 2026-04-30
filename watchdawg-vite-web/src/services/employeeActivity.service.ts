/** @format */

import type { Activity } from "@/types/employeeDashboard.types";
import { api } from "./api";

/* ============================== */
/* 🧠 STATE                       */
/* ============================== */

let lastCallTime = 0;
let cooldownUntil = 0;

const REQUEST_INTERVAL = 15000;

/* ============================== */
/* 🔧 NORMALIZERS                 */
/* ============================== */

const normalizeCategory = (val?: unknown): Activity["category"] => {
  if (val === "productive") return "productive";
  if (val === "distracting") return "distracting";
  return "neutral";
};

const normalizeStatus = (val?: unknown): Activity["status"] => {
  if (val === "active") return "active";
  if (val === "idle") return "idle";
  return "away";
};

const safeNumber = (val: unknown, fallback = 0): number => {
  const num = Number(val);
  return Number.isFinite(num) ? num : fallback;
};

const safeString = (val: unknown, fallback = ""): string => {
  return typeof val === "string" && val.trim() ? val : fallback;
};

/* ============================== */
/* 🔄 SAFE MAPPER                 */
/* ============================== */

const mapToActivity = (
  item: Record<string, unknown>
): Activity | null => {
  const userId = safeString(item.userId);
  const organizationId = safeString(item.organizationId);

  /* ❌ skip invalid */
  if (!userId || !organizationId) {
    console.warn("⚠️ Skipping invalid activity item");
    return null;
  }

  const now = Date.now();

  /* ============================== */
  /* 🧠 APP + PLATFORM              */
  /* ============================== */

  const app =
    safeString(item.app) ||
    safeString(item.application) ||
    "Unknown";

  const platform =
    safeString(item.platform) ||
    safeString(item.domain) ||
    app ||
    "Unknown";

  /* ============================== */
  /* ⏱ TIMESTAMP                   */
  /* ============================== */

  let timestamp = now;

  if (typeof item.timestamp === "number") {
    timestamp = item.timestamp;
  } else if (typeof item.time === "string") {
    const parsed = new Date(item.time).getTime();
    if (!Number.isNaN(parsed)) timestamp = parsed;
  }

  /* ============================== */
  /* 🎵 BACKGROUND                 */
  /* ============================== */

  let background: Activity["background"] = null;

  if (item.background && typeof item.background === "object") {
    const bg = item.background as Record<string, unknown>;

    background = {
  platform:
    safeString(bg.platform) ||
    safeString(bg.app) ||
    "Unknown",

  category: normalizeCategory(bg.category),

  duration: safeNumber(bg.duration),
};
  }

  /* ============================== */
  /* 🚀 FINAL OBJECT                */
  /* ============================== */

  return {
    userId,
    organizationId,

    name: safeString(item.name, "Unknown"),

    app,
    title: safeString(item.title),

    platform,

    category: normalizeCategory(
      item.category ||
        (item.workStatus === "focus"
          ? "productive"
          : item.workStatus === "distract"
          ? "distracting"
          : "neutral")
    ),

    status: normalizeStatus(item.status),

    duration: safeNumber(item.duration),

    timestamp,

    source: item.source === "extension" ? "extension" : "agent",

    background,
  };
};

/* ============================== */
/* 🚀 MAIN FETCH                  */
/* ============================== */

export const getMyActivity = async (): Promise<{
  data: Activity[] | null;
  cooldown?: number;
  skipped?: number;
  nextSyncAt?: number;
}> => {
  const now = Date.now();

  /* ============================== */
  /* ⛔ COOLDOWN                   */
  /* ============================== */

  if (now < cooldownUntil) {
    return {
      data: null,
      cooldown: Math.ceil((cooldownUntil - now) / 1000),
      nextSyncAt: cooldownUntil,
    };
  }

  /* ============================== */
  /* ⏱ INTERVAL CONTROL            */
  /* ============================== */

  const timeSinceLast = now - lastCallTime;

  if (timeSinceLast < REQUEST_INTERVAL) {
    const nextTime = lastCallTime + REQUEST_INTERVAL;

    return {
      data: null,
      skipped: Math.ceil((nextTime - now) / 1000),
      nextSyncAt: nextTime,
    };
  }

  try {
    console.log("📡 API CALL → /employee/activity");

    const res = await api.get("/employee/activity", {
      timeout: 5000,
    });

    const response = res?.data;

    console.log("📥 RAW BACKEND:", response);

    if (!response?.success) {
      return { data: [] };
    }

    const raw = Array.isArray(response.data)
      ? response.data
      : [];

    /* ============================== */
    /* 🔥 NORMALIZATION               */
    /* ============================== */

    const normalized: Activity[] = raw
      .map(mapToActivity)
      .filter(Boolean) as Activity[];

    console.log("✅ NORMALIZED:", normalized.length);

    /* ============================== */
    /* 🔄 UPDATE STATE                */
    /* ============================== */

    lastCallTime = Date.now(); // ✅ FIXED
    cooldownUntil = 0;

    return {
      data: normalized,
      nextSyncAt: lastCallTime + REQUEST_INTERVAL,
    };
  } catch (err: any) {
    const status = err?.response?.status;

    /* ============================== */
    /* 🚫 RATE LIMIT                 */
    /* ============================== */

    if (status === 429) {
      cooldownUntil = Date.now() + 30000;

      console.warn("🚫 Rate limited → cooldown 30s");

      return {
        data: null,
        cooldown: 30,
        nextSyncAt: cooldownUntil,
      };
    }

    console.error("❌ API Error:", status || err?.message);

    return { data: null };
  }
};

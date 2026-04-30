/** @format */

import type {
  Activity,
  ActivityCategory,
  ActivityStatus,
  AdminStats,
  LiveActivityMap,
} from "@/types/adminDashboard.types";
import { create } from "zustand";

/* ============================== */
/* 🧠 TYPES                       */
/* ============================== */

type SocketActivityUpdate = Partial<Activity> & {
  userId: string;
};

/* ============================== */
/* 🧠 NORMALIZERS                 */
/* ============================== */

const normalizeCategory = (v?: string): ActivityCategory => {
  if (v === "productive") return "productive";
  if (v === "distracting") return "distracting";
  return "neutral";
};

const normalizeStatus = (v?: string): ActivityStatus => {
  if (v === "active") return "active";
  if (v === "idle") return "idle";
  return "away";
};

/* ============================== */
/* 🧠 STATS (FAST)                */
/* ============================== */

function computeStatsFast(map: LiveActivityMap): AdminStats {
  let active = 0,
    idle = 0,
    away = 0,
    productive = 0,
    distracting = 0,
    neutral = 0;

  for (const id in map) {
    const a = map[id];

    if (a.status === "active") active++;
    else if (a.status === "idle") idle++;
    else away++;

    if (a.category === "productive") productive++;
    else if (a.category === "distracting") distracting++;
    else neutral++;
  }

  const total = active + idle + away;

  return {
    totalUsers: total,
    active,
    idle,
    away,
    productive,
    distracting,
    neutral,
    productivityScore:
      total === 0 ? 0 : Math.round((productive / total) * 100),
  };
}

/* ============================== */
/* 🧠 STATE                       */
/* ============================== */

interface AdminState {
  liveActivities: LiveActivityMap;
  stats: AdminStats;
  activityFeed: {
    id: string;
    userId: string;
    name: string;
    message: string;
    timestamp: number;
  }[];

  lastUpdated: number;

  updateFromSocket: (a: SocketActivityUpdate) => void;
  setBulkActivities: (a: Activity[]) => void;
  addToFeed: (item: AdminState["activityFeed"][0]) => void;
  clear: () => void;
}

/* ============================== */
/* 🚀 STORE                       */
/* ============================== */

export const useAdminStore = create<AdminState>((set, get) => ({
  liveActivities: {},

  stats: {
    totalUsers: 0,
    active: 0,
    idle: 0,
    away: 0,
    productive: 0,
    distracting: 0,
    neutral: 0,
    productivityScore: 0,
  },

  activityFeed: [],
  lastUpdated: 0,

  /* ============================== */
  /* 🔥 SOCKET UPDATE (OPTIMIZED)   */
  /* ============================== */

  updateFromSocket: (activity) =>
    set((state) => {
      if (!activity?.userId) return state;

      const prev = state.liveActivities[activity.userId];

      const merged: Activity = {
        userId: activity.userId,
        organizationId:
          activity.organizationId ?? prev?.organizationId ?? "unknown",

        name: activity.name ?? prev?.name ?? "Unknown",

        app: activity.app ?? prev?.app ?? "Working",
        title: activity.title ?? prev?.title ?? "",

        platform: activity.platform ?? prev?.platform ?? "Unknown",

        category: normalizeCategory(
          activity.category ?? prev?.category
        ),

        status: normalizeStatus(activity.status ?? prev?.status),

        duration: activity.duration ?? prev?.duration ?? 0,

        timestamp: activity.timestamp ?? Date.now(),

        source: activity.source ?? prev?.source ?? "agent",

        background: activity.background ?? prev?.background ?? null,

        lastUpdated: Date.now(),
      };

      /* ✅ MUTATE MAP (SAFE + FAST) */
      const map = state.liveActivities;
      map[activity.userId] = merged;

      return {
        liveActivities: { ...map }, // shallow clone once
        stats: computeStatsFast(map),
        lastUpdated: Date.now(),
      };
    }),

  /* ============================== */
  /* 🔥 BULK LOAD                   */
  /* ============================== */

  setBulkActivities: (activities) =>
    set(() => {
      const map: LiveActivityMap = {};

      for (const a of activities) {
        if (!a.userId) continue;

        map[a.userId] = {
          ...a,
          lastUpdated: Date.now(),
        };
      }

      return {
        liveActivities: map,
        stats: computeStatsFast(map),
        lastUpdated: Date.now(),
      };
    }),

  /* ============================== */
  /* 📜 FEED                        */
  /* ============================== */

  addToFeed: (item) =>
    set((state) => ({
      activityFeed: [item, ...state.activityFeed].slice(0, 50),
    })),

  /* ============================== */
  /* 🧹 RESET                       */
  /* ============================== */

  clear: () =>
    set({
      liveActivities: {},
      activityFeed: [],
      stats: {
        totalUsers: 0,
        active: 0,
        idle: 0,
        away: 0,
        productive: 0,
        distracting: 0,
        neutral: 0,
        productivityScore: 0,
      },
      lastUpdated: 0,
    }),
}));

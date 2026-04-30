/** @format */

import { create } from "zustand";

/* ============================== */
/* 📦 TYPES                       */
/* ============================== */

export interface Totals {
  status: {
    active: number;
    idle: number;
    away: number;
  };
  category: {
    productive: number;
    distracting: number;
    neutral: number;
  };
}

export interface AppItem {
  app: string;
  duration: number;
}

interface TickPayload {
  app: string;
  status: "active" | "idle" | "away";
  category: "productive" | "neutral" | "distracting";
}

interface AnalyticsState {
  totals: Totals;

  liveApps: Record<string, number>;
  topApps: AppItem[];

  tick: (activity: TickPayload) => void;
  reset: () => void;
}

/* ============================== */
/* 🧠 HELPERS                     */
/* ============================== */

const createDefaultTotals = (): Totals => ({
  status: { active: 0, idle: 0, away: 0 },
  category: { productive: 0, distracting: 0, neutral: 0 },
});

const normalizeApp = (app?: string): string => {
  if (!app) return "Unknown";

  return app
    .toLowerCase()
    .replace(".exe", "")
    .trim();
};

/* ============================== */
/* 🏪 STORE                       */
/* ============================== */

export const useAnalyticsStore = create<AnalyticsState>((set, get) => {
  let saveThrottle = 0;
  let cachedTopApps: AppItem[] = [];

  return {
    /* ============================== */
    /* 🔥 STATE                       */
    /* ============================== */

    totals: createDefaultTotals(),
    liveApps: {},
    topApps: [],

    /* ============================== */
    /* ⏱ TICK (CALLED EVERY SECOND)  */
    /* ============================== */

    tick: (activity) => {
      if (!activity?.app || !activity?.status) return;

      set((state) => {
        const totals = {
          status: { ...state.totals.status },
          category: { ...state.totals.category },
        };

        const liveApps = { ...state.liveApps };

        /* ========================== */
        /* 📊 STATUS                  */
        /* ========================== */

        if (activity.status === "active") totals.status.active++;
        else if (activity.status === "idle") totals.status.idle++;
        else totals.status.away++;

        /* ========================== */
        /* 📊 CATEGORY                */
        /* ========================== */

        if (activity.category === "productive")
          totals.category.productive++;
        else if (activity.category === "distracting")
          totals.category.distracting++;
        else totals.category.neutral++;

        /* ========================== */
        /* 📊 APP TRACKING            */
        /* ========================== */

        if (activity.status === "active") {
          const key = normalizeApp(activity.app);
          liveApps[key] = (liveApps[key] || 0) + 1;
        }

        /* ========================== */
        /* ⚡ TOP APPS (OPTIMIZED)    */
        /* ========================== */

        if (saveThrottle % 3 === 0) {
          cachedTopApps = Object.entries(liveApps)
            .map(([app, duration]) => ({
              app,
              duration: Number(duration) || 0,
            }))
            .sort((a, b) => b.duration - a.duration)
            .slice(0, 5);
        }

        saveThrottle++;

        return {
          totals,
          liveApps,
          topApps: cachedTopApps,
        };
      });
    },

    /* ============================== */
    /* 🧹 RESET                       */
    /* ============================== */

    reset: () => ({
      totals: createDefaultTotals(),
      liveApps: {},
      topApps: [],
    }),
  };
});

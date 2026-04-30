/** @format */

import type { LiveActivity } from "@/types/employeeDashboard.types";
import { create } from "zustand";

/* ============================== */
/* 📦 TYPES                       */
/* ============================== */

interface Session {
  id: string;
  app: string;
  title?: string;

  startTime: number;
  endTime?: number;

  durations: {
    active: number;
    idle: number;
    away: number;
  };
}

interface ActivityState {
  live: LiveActivity | null;

  currentSession: Session | null;
  sessions: Session[];

  updateFromSocket: (activity: LiveActivity) => void;
  tick: () => void; // 🔥 important
  reset: () => void;
}

/* ============================== */
/* 🧠 PRIORITY SYSTEM             */
/* ============================== */

const getPriority = (app?: string): number => {
  if (!app) return 0;

  const a = app.toLowerCase();

  if (a.includes("code")) return 3;
  if (a.includes("terminal")) return 3;

  if (a.includes("chrome") || a.includes("edge") || a.includes("firefox"))
    return 1;

  return 2;
};

/* ============================== */
/* 🏪 STORE                       */
/* ============================== */

export const useActivityStore = create<ActivityState>((set, get) => {
  let lastSwitchTime = 0;

  return {
    live: null,
    currentSession: null,
    sessions: [],

    /* ============================== */
    /* 🚀 SOCKET UPDATE               */
    /* ============================== */

    updateFromSocket: (activity) => {
      if (!activity?.userId) return;

      set((state) => {
        const prev = state.live;

        /* ========================== */
        /* 🛑 IGNORE STALE            */
        /* ========================== */

        if (
          prev?.timestamp &&
          activity.timestamp &&
          activity.timestamp < prev.timestamp
        ) {
          return state;
        }

        /* ========================== */
        /* 🧠 PRIORITY (SOFT LOCK)    */
        /* ========================== */

        const now = Date.now();

        const prevPriority = getPriority(prev?.app);
        const newPriority = getPriority(activity.app);

        const withinLock = now - lastSwitchTime < 1500;

        if (prev && newPriority < prevPriority && withinLock) {
          return state;
        }

        /* ========================== */
        /* 🔥 CHANGE DETECTION        */
        /* ========================== */

        const isAppChanged =
          prev?.app !== activity.app ||
          prev?.title !== activity.title;

        let sessions = [...state.sessions];
        let currentSession = state.currentSession;

        /* ========================== */
        /* 🔄 CLOSE SESSION           */
        /* ========================== */

        if (isAppChanged && currentSession) {
          sessions.push({
            ...currentSession,
            endTime: now,
          });

          lastSwitchTime = now;
        }

        /* ========================== */
        /* 🆕 NEW SESSION             */
        /* ========================== */

        if (isAppChanged || !currentSession) {
          currentSession = {
            id: crypto.randomUUID(),
            app: activity.app,
            title: activity.title,
            startTime: now,
            durations: {
              active: 0,
              idle: 0,
              away: 0,
            },
          };
        }

        return {
          live: {
            ...activity,
            lastUpdated: Date.now(),
          },
          currentSession,
          sessions,
        };
      });
    },

    /* ============================== */
    /* ⏱ TICK (1 sec)                */
    /* ============================== */

    tick: () => {
      const state = get();
      const live = state.live;
      const session = state.currentSession;

      if (!live || !session) return;

      set({
        currentSession: {
          ...session,
          durations: {
            active:
              session.durations.active +
              (live.status === "active" ? 1 : 0),
            idle:
              session.durations.idle +
              (live.status === "idle" ? 1 : 0),
            away:
              session.durations.away +
              (live.status === "away" ? 1 : 0),
          },
        },
      });
    },

    /* ============================== */
    /* 🧹 RESET                       */
    /* ============================== */

    reset: () => ({
      live: null,
      currentSession: null,
      sessions: [],
    }),
  };
});

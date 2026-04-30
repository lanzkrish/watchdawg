/** @format */

import type { Activity } from "@/types/employeeDashboard.types";
import { create } from "zustand";

/* ============================== */
/* 📦 TYPES                       */
/* ============================== */

interface ApiActivityState {
  /* 📊 DATA */
  data: Activity[];

  /* ⏳ STATE */
  loading: boolean;
  error: string | null;

  /* ⏱ CONTROL */
  lastFetched: number;
  cooldown: number;

  /* 🚀 ACTIONS */
  setData: (data: Activity[]) => void;
  addData: (data: Activity[]) => void;

  setLoading: (val: boolean) => void;
  setError: (err: string | null) => void;

  setCooldown: (sec: number) => void;
  setLastFetched: (time: number) => void;

  reset: () => void;
}

/* ============================== */
/* 🏪 STORE                       */
/* ============================== */

export const useApiActivityStore = create<ApiActivityState>((set) => ({
  /* ============================== */
  /* 🔥 STATE                       */
  /* ============================== */

  data: [],

  loading: false,
  error: null,

  lastFetched: 0,
  cooldown: 0,

  /* ============================== */
  /* 📊 SET DATA                    */
  /* ============================== */

  setData: (data) =>
    set({
      data,
      lastFetched: Date.now(),
      loading: false,
      error: null,
    }),

  /* ============================== */
  /* ➕ APPEND DATA (PAGINATION)     */
  /* ============================== */

  addData: (incoming) =>
    set((state) => {
      const existing = new Set(
        state.data.map((i) => `${i.timestamp}-${i.app}-${i.title}`)
      );

      const fresh = incoming.filter(
        (i) =>
          !existing.has(`${i.timestamp}-${i.app}-${i.title}`)
      );

      return {
        data: [...state.data, ...fresh],
      };
    }),

  /* ============================== */
  /* ⏳ LOADING                     */
  /* ============================== */

  setLoading: (val) => set({ loading: val }),

  /* ============================== */
  /* ❌ ERROR                       */
  /* ============================== */

  setError: (err) => set({ error: err }),

  /* ============================== */
  /* ⏱ COOLDOWN                     */
  /* ============================== */

  setCooldown: (sec) => set({ cooldown: sec }),

  setLastFetched: (time) => set({ lastFetched: time }),

  /* ============================== */
  /* 🧹 RESET                       */
  /* ============================== */

  reset: () =>
    set({
      data: [],
      loading: false,
      error: null,
      lastFetched: 0,
      cooldown: 0,
    }),
}));

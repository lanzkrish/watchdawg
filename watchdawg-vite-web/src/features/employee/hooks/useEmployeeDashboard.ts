/** @format */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type {
  AppUsage,
  EmployeeDashboardData,
} from "@/types/employeeDashboard.types";

import { getEmployeeDashboard } from "@/services/employeeDashboard.service";

import { useActivityStore } from "@/store/activity.store";
import { useAnalyticsStore } from "@/store/analytics.store";

/* ============================== */
/* 🧠 DEFAULT                     */
/* ============================== */

const defaultData: EmployeeDashboardData = {
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
/* 🚀 HOOK                        */
/* ============================== */

export const useEmployeeDashboard = () => {
  const [data, setData] = useState<EmployeeDashboardData>(defaultData);
  const [loading, setLoading] = useState(true);

  const abortRef = useRef<AbortController | null>(null);
  const lastSocketUpdate = useRef(Date.now());
  const uiUnlocked = useRef(false);

  /* ============================== */
  /* 🧠 STORES                     */
  /* ============================== */

  const live = useActivityStore((s) => s.live);
  const totals = useAnalyticsStore((s) => s.totals);
  const topApps = useAnalyticsStore((s) => s.topApps);

  /* ============================== */
  /* 🔥 SOCKET PRIORITY            */
  /* ============================== */

  useEffect(() => {
    if (!live) return;

    lastSocketUpdate.current = Date.now();

    if (!uiUnlocked.current) {
      console.log("⚡ UI unlocked via SOCKET");
      setLoading(false);
      uiUnlocked.current = true;
    }
  }, [live]);

  /* ============================== */
  /* 🔄 API FALLBACK               */
  /* ============================== */

  const fetchAPI = useCallback(async () => {
    try {
      abortRef.current?.abort();

      const controller = new AbortController();
      abortRef.current = controller;

      const res = await getEmployeeDashboard({
        signal: controller.signal,
      });

      if (!res) return;

      console.log("📊 API fallback success");

      setData(res);

      if (!uiUnlocked.current) {
        setLoading(false);
        uiUnlocked.current = true;
      }
    } catch (err: any) {
      if (err.name !== "AbortError") {
        console.error("❌ API failed:", err.message);
      }
    }
  }, []);

  /* ============================== */
  /* ⏱ FAILSAFE UNLOCK            */
  /* ============================== */

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!uiUnlocked.current) {
        console.warn("⚠️ Force UI unlock (no socket/API)");
        setLoading(false);
        uiUnlocked.current = true;
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  /* ============================== */
  /* 🔁 SOCKET HEALTH CHECK        */
  /* ============================== */

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();

      const socketDead = now - lastSocketUpdate.current > 10000;

      if (socketDead) {
        console.warn("⚠️ Socket stale → fallback API");
        fetchAPI();
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [fetchAPI]);

  /* ============================== */
  /* 📊 DERIVED STATS             */
  /* ============================== */

  const computedStats = useMemo(() => {
    const p = totals.category.productive;
    const d = totals.category.distracting;
    const n = totals.category.neutral;

    const total = p + d + n;

    if (total === 0) {
      return {
        totalTime: 0,
        productiveTime: 0,
        distractingTime: 0,
        neutralTime: 0,
        productivityScore: 0,
      };
    }

    return {
      totalTime: total,
      productiveTime: p,
      distractingTime: d,
      neutralTime: n,
      productivityScore: Math.round((p / total) * 100),
    };
  }, [totals]);

  /* ============================== */
  /* 📊 DERIVED APPS              */
  /* ============================== */

  const computedApps: AppUsage[] | null = useMemo(() => {
    if (!topApps.length) return null;

    const total = topApps.reduce((sum, a) => sum + a.duration, 0);
    if (total === 0) return null;

    return topApps.map((a) => ({
      app: a.app,
      duration: a.duration,
      percentage: Math.round((a.duration / total) * 100),
    }));
  }, [topApps]);

  /* ============================== */
  /* 🔗 FINAL MERGE               */
  /* ============================== */

  const mergedData: EmployeeDashboardData = useMemo(() => {
    return {
      ...data,

      /* 🔥 REALTIME PRIORITY */
      live: live ?? data.live ?? null,

      stats: computedStats,
      apps: computedApps ?? data.apps,
    };
  }, [data, live, computedStats, computedApps]);

  /* ============================== */
  /* 🔁 MANUAL REFETCH            */
  /* ============================== */

  const refetch = useCallback(() => {
    fetchAPI();
  }, [fetchAPI]);

  /* ============================== */
  /* 🚀 RETURN                    */
  /* ============================== */

  return {
    data: mergedData,
    loading,
    refetch,
  };
};

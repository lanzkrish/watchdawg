/** @format */

import { getSocket } from "@/lib/socket";
import { useAuthStore } from "@/store/auth.store";
import { useEffect, useRef, useState } from "react";

/* ============================== */
/* 📦 TYPES                       */
/* ============================== */

interface LiveActivity {
  userId: string;
  app: string;
  status: "active" | "idle" | "away";
  timestamp: number;
}

interface AppStats {
  app: string;
  duration: number;
}

interface Totals {
  active: number;
  idle: number;
  away: number;
}

/* ============================== */
/* 🧠 STORAGE                     */
/* ============================== */

const loadInitial = () => {
  try {
    const stored = localStorage.getItem("watchdawg_live");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

/* ============================== */
/* 🚀 HOOK                        */
/* ============================== */

export const useMyLiveActivity = () => {
  const { user } = useAuthStore();
  const socket = getSocket();

  const initial = loadInitial();

  const [current, setCurrent] = useState<LiveActivity | null>(null);
  const [apps, setApps] = useState<Record<string, number>>(
    initial?.apps || {}
  );
  const [totals, setTotals] = useState<Totals>(
    initial?.totals || {
      active: 0,
      idle: 0,
      away: 0,
    }
  );
  const [isLive, setIsLive] = useState(false);

  const lastEventRef = useRef<LiveActivity | null>(null);

  /* ============================== */
  /* ⚡ SOCKET LISTENER             */
  /* ============================== */

  useEffect(() => {
    if (!user?.id || !socket) return;

    const handleActivity = (data: any) => {
      if (data.userId !== user.id) return;

      const nowEvent: LiveActivity = {
        userId: data.userId,
        app: data.app,
        status: data.status,
        timestamp: data.timestamp || Date.now(),
      };

      setCurrent(nowEvent);
      setIsLive(true);

      /* ========================== */
      /* ⏱ DELTA CALCULATION       */
      /* ========================== */

      const prev = lastEventRef.current;

      if (prev) {
        const delta = Math.floor(
          (nowEvent.timestamp - prev.timestamp) / 1000
        );

        if (delta > 0 && delta < 60) {
          /* ✅ APP TIME */
          if (prev.status === "active") {
            setApps((p) => ({
              ...p,
              [prev.app]: (p[prev.app] || 0) + delta,
            }));
          }

          /* ✅ TOTAL TIME */
          setTotals((p) => ({
            active: p.active + (prev.status === "active" ? delta : 0),
            idle: p.idle + (prev.status === "idle" ? delta : 0),
            away: p.away + (prev.status === "away" ? delta : 0),
          }));
        }
      }

      lastEventRef.current = nowEvent;
    };

    socket.on("activity_update", handleActivity);

    return () => {
      socket.off("activity_update", handleActivity);
    };
  }, [user?.id, socket]);

  /* ============================== */
  /* 💾 SAVE STATE                 */
  /* ============================== */

  useEffect(() => {
    localStorage.setItem(
      "watchdawg_live",
      JSON.stringify({ apps, totals })
    );
  }, [apps, totals]);

  /* ============================== */
  /* ⛔ LIVE TIMEOUT               */
  /* ============================== */

  useEffect(() => {
    if (!current) return;

    const timeout = setTimeout(() => {
      setIsLive(false);
    }, 8000);

    return () => clearTimeout(timeout);
  }, [current]);

  /* ============================== */
  /* 🔥 TOP APPS                   */
  /* ============================== */

  const topApps: AppStats[] = Object.entries(apps)
    .map(([app, duration]) => ({ app, duration }))
    .sort((a, b) => b.duration - a.duration)
    .slice(0, 3);

  return { current, isLive, topApps, totals };
};

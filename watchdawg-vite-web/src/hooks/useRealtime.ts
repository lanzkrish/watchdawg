/** @format */

import { useEffect, useRef } from "react";

import { getSocket } from "@/lib/socket";
import { useAuthStore } from "@/store/auth.store";

import { useActivityStore } from "@/store/activity.store";
import { useAnalyticsStore } from "@/store/analytics.store";

/* ============================== */
/* 🧾 TYPES                       */
/* ============================== */

type ActivityCategory = "productive" | "neutral" | "distracting";
type ActivityStatus = "active" | "idle" | "away";

type RawActivity = {
  userId: string;
  organizationId?: string;
  name?: string;

  app?: string;
  title?: string;
  platform?: string;

  category?: string;
  status?: string;

  duration?: number;
  timestamp?: number;
};

/* ============================== */
/* 🔧 NORMALIZERS                 */
/* ============================== */

const normalizeCategory = (val?: string): ActivityCategory => {
  if (val === "productive") return "productive";
  if (val === "distracting") return "distracting";
  return "neutral";
};

const normalizeStatus = (val?: string): ActivityStatus => {
  if (val === "active") return "active";
  if (val === "idle") return "idle";
  return "away";
};

/* ============================== */
/* 🚀 HOOK                        */
/* ============================== */

export const useRealtime = () => {
  const { user } = useAuthStore();

  const isBoundRef = useRef(false);

  useEffect(() => {
    const socket = getSocket();

    const orgId = user?.organizationId;
    const userId = user?.id;
    const role = user?.role;

    if (!socket || !orgId || !userId || !role) return;
    if (isBoundRef.current) return;

    isBoundRef.current = true;

    console.log("🎧 Realtime READY", { orgId, userId, role });

    /* ============================== */
    /* 🔥 MAIN HANDLER                */
    /* ============================== */

    const handleActivity = (u: RawActivity) => {
      if (!u?.userId) return;

      /* 🔒 ORG FILTER */
      if (u.organizationId && u.organizationId !== orgId) return;

      /* 🔒 EMPLOYEE FILTER */
      if (role === "employee" && u.userId !== userId) return;

      const normalized = {
        userId: u.userId,
        organizationId: u.organizationId ?? orgId,

        name: u.name ?? "Unknown",

        app: u.app ?? "Working",
        title: u.title ?? "",
        platform: u.platform ?? "Unknown",

        category: normalizeCategory(u.category),
        status: normalizeStatus(u.status),

        duration: u.duration ?? 0,
        timestamp: u.timestamp ?? Date.now(),

        source: "agent" as const,
      };

      console.log("📡 ACTIVITY:", normalized);

      /* ============================== */
      /* 🔥 UPDATE ACTIVITY STORE       */
      /* ============================== */

      useActivityStore.getState().updateFromSocket(normalized);

      /* ============================== */
      /* 🔥 UPDATE ANALYTICS STORE      */
      /* ============================== */

      useAnalyticsStore.getState().tick({
        app: normalized.app,
        status: normalized.status,
        category: normalized.category,
      });
    };

    /* ============================== */
    /* 🎯 ROLE EVENTS                 */
    /* ============================== */

    if (role === "employee") {
      socket.on("employee:self", handleActivity);
      console.log("✅ Listening: employee:self");
    } else {
      socket.on("admin:update", handleActivity);
      console.log("✅ Listening: admin:update");
    }

    /* ============================== */
    /* 🧹 CLEANUP                     */
    /* ============================== */

    return () => {
      console.log("🧹 Realtime cleanup");

      socket.off("employee:self", handleActivity);
      socket.off("admin:update", handleActivity);

      isBoundRef.current = false;
    };
  }, [user?.organizationId, user?.id, user?.role]);
};

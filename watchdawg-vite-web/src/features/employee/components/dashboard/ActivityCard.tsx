/** @format */

import { useAuthStore } from "@/store/auth.store";
import type { LiveActivity } from "@/types/employeeDashboard.types";
import { useEffect } from "react";
import LiveTimer from "./LiveTimer";

/* ============================== */
/* 🎨 HELPERS                     */
/* ============================== */

const statusConfig = {
  active: {
    color: "text-green-400",
    glow: "shadow-[0_0_30px_rgba(34,197,94,0.15)]",
  },
  idle: {
    color: "text-yellow-400",
    glow: "shadow-[0_0_30px_rgba(250,204,21,0.12)]",
  },
  away: {
    color: "text-red-400",
    glow: "shadow-[0_0_30px_rgba(239,68,68,0.12)]",
  },
};

const categoryStyle = {
  productive:
    "bg-green-500/10 text-green-400 border border-green-500/20",
  distracting:
    "bg-red-500/10 text-red-400 border border-red-500/20",
  neutral:
    "bg-gray-500/10 text-gray-400 border border-gray-500/20",
};

/* ============================== */
/* 🧩 COMPONENT                   */
/* ============================== */

interface Props {
  data: LiveActivity | null;
}

export default function ActivityCard({ data }: Props) {
  const { user } = useAuthStore();

  /* ============================== */
  /* 🧪 DEBUG BLOCK (IMPORTANT)     */
  /* ============================== */

  useEffect(() => {
    console.log("🎯 ActivityCard RECEIVED DATA:", data);

    if (!data) {
      console.warn("⚠️ No live activity data");
    } else {
      console.table({
        app: data.app,
        title: data.title,
        platform: data.platform,
        category: data.category,
        status: data.status,
        duration: data.duration,
        lastUpdated: data.lastUpdated,
      });
    }
  }, [data]);

  /* ============================== */

  if (!data) {
    return (
      <div className="bg-[#1e293b] p-6 rounded-2xl text-gray-400 text-sm border border-white/5">
        No activity detected
      </div>
    );
  }

  const status = statusConfig[data.status] || statusConfig.idle;

  return (
    <div
      className={`
        relative overflow-hidden
        bg-gradient-to-br from-[#1e293b] to-[#0f172a]
        p-6 rounded-2xl border border-white/5
        transition-all duration-300
        hover:border-white/10 hover:scale-[1.01]
        ${status.glow}
      `}
    >
      {/* 🔥 USER HEADER */}
      <div className="relative flex justify-between items-center mb-4">

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-semibold">
            {user?.name?.charAt(0) || "U"}
          </div>

          <div>
            <p className="text-sm text-white font-medium">
              {user?.name || "User"}
            </p>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">
              Live Monitoring
            </p>
          </div>
        </div>

        <div className={`text-xs font-medium ${status.color}`}>
          ● {data.status}
        </div>
      </div>

      {/* CONTENT */}
      <div className="relative flex justify-between items-center">

        <div className="space-y-2 max-w-[65%]">
          <h2 className="text-xl font-semibold text-white truncate">
            {data.app || "Unknown"}
          </h2>

          <p className="text-gray-300 text-sm truncate">
            {data.title || "No title"}
          </p>

          <div className="flex items-center gap-2 text-xs mt-1">
            <span className="text-gray-400 font-medium">
              {data.platform || "Unknown"}
            </span>

            <span className="text-gray-600">•</span>

            <span
              className={`px-2 py-[2px] rounded-md text-[10px] capitalize ${
                categoryStyle[data.category] ||
                categoryStyle.neutral
              }`}
            >
              {data.category || "neutral"}
            </span>
          </div>
        </div>

        <div className="text-right space-y-2">
          <div className="text-2xl font-mono tracking-widest text-white">
            <LiveTimer
              baseDuration={data.duration || 0}
              lastUpdated={data.lastUpdated ?? Date.now()}
            />
          </div>

          <p className="text-[10px] text-gray-500 uppercase tracking-widest">
            elapsed
          </p>
        </div>
      </div>
    </div>
  );
}

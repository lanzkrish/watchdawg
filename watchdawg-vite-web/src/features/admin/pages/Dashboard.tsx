/** @format */

import { motion } from "framer-motion";
import { useMemo } from "react";

import { useAdminStore } from "@/store/admin.store";

import ActivityHeatmap from "@/features/admin/components/dashboard/ActivityHeatmap";
import DashboardHeader from "@/features/admin/components/dashboard/DashboardHeader";
import EmployeeLiveList from "@/features/admin/components/dashboard/EmployeeLiveList";
import LiveOverview from "@/features/admin/components/dashboard/LiveOverview";
import StatsGrid from "@/features/admin/components/dashboard/StatsGrid";

import { generateHeatmap } from "@/utils/getHeatmap";

export default function AdminDashboard() {
  /* ============================== */
  /* 🧠 STORE (ONLY SOURCE)         */
  /* ============================== */

  const liveActivities = useAdminStore((s) => s.liveActivities);

  /* ============================== */
  /* 🔥 DERIVED DATA                */
  /* ============================== */

  const liveArray = useMemo(() => {
    return Object.values(liveActivities || {});
  }, [liveActivities]);

  const heatmapData = useMemo(
    () => generateHeatmap(liveArray),
    [liveArray]
  );

  /* ============================== */
  /* ⏳ EMPTY STATE                 */
  /* ============================== */

  if (liveArray.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-gray-400 gap-3">
        <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
        <p>Waiting for live activity...</p>
      </div>
    );
  }

  /* ============================== */
  /* 🚀 UI                          */
  /* ============================== */

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative space-y-6"
    >
      {/* 🌌 BACKGROUND */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-500/10 to-purple-500/10 blur-3xl" />

      {/* 🔥 HEADER */}
      <DashboardHeader />

      {/* ⚡ LIVE OVERVIEW */}
      <LiveOverview live={liveArray} />

      {/* 📊 STATS */}
      <StatsGrid live={liveArray} />

      {/* 🔥 INTELLIGENCE */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <ActivityHeatmap data={heatmapData} />
        </div>

        <div className="p-6 rounded-2xl bg-white/5 backdrop-blur border border-white/10">
          <h3 className="text-white font-semibold mb-4">
            Insights
          </h3>

          <div className="space-y-3 text-sm">
            <p className="text-green-400">
              🟢 Active users:{" "}
              {liveArray.filter((l) => l.status === "active").length}
            </p>

            <p className="text-yellow-400">
              ⚠️ Idle users:{" "}
              {liveArray.filter((l) => l.status === "idle").length}
            </p>

            <p className="text-red-400">
              🔴 Away users:{" "}
              {liveArray.filter((l) => l.status === "away").length}
            </p>

            <p className="text-blue-400">
              ⚡ Productive apps:{" "}
              {liveArray.filter((l) => l.category === "productive").length}
            </p>
          </div>
        </div>
      </div>

      {/* 👥 EMPLOYEE LIST */}
      <EmployeeLiveList live={liveArray} />
    </motion.div>
  );
}

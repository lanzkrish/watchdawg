/** @format */

import { useEmployeeDashboard } from "@/features/employee/hooks/useEmployeeDashboard";

import { useActivityStore } from "@/store/activity.store";
import { useAnalyticsStore } from "@/store/analytics.store";

import ActivityCard from "@/features/employee/components/dashboard/ActivityCard";
import ProductivityChart from "@/features/employee/components/dashboard/ProductivityChart";
import Tasks from "@/features/employee/components/dashboard/Tasks";
import TimeLine from "@/features/employee/components/dashboard/TimeLine";

export default function EmployeeDashboard() {
  const { data, loading } = useEmployeeDashboard();

  /* ============================== */
  /* 🧠 STORES (CORRECT)           */
  /* ============================== */

  const totals = useAnalyticsStore((s) => s.totals);
  const live = useActivityStore((s) => s.live);

  /* ============================== */
  /* ⏳ LOADING                     */
  /* ============================== */

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-gray-500">
        Loading dashboard...
      </div>
    );
  }

  /* ============================== */
  /* 🔥 LIVE PRIORITY               */
  /* ============================== */

  const currentLive = live ?? data?.live ?? null;

  /* ============================== */
  /* 📊 STATS (STORE ONLY)          */
  /* ============================== */

  const productive = totals.category.productive;
  const distracting = totals.category.distracting;
  const neutral = totals.category.neutral;

  const totalTime = productive + distracting + neutral || 1;

  const stats = {
    totalTime,
    productiveTime: productive,
    distractingTime: distracting,
    neutralTime: neutral,
    productivityScore: Math.round((productive / totalTime) * 100),
  };

  /* ============================== */
  /* 🚀 UI                          */
  /* ============================== */

  return (
    <div className="space-y-6">

      {/* 🔥 LIVE */}
      <ActivityCard data={currentLive} />

      {/* GRID */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* TASKS */}
        <Tasks />

        {/* TIMELINE */}
        <TimeLine />

      </div>

      {/* 📈 TREND */}
      <div className="bg-white border rounded-lg p-5">
        <h3 className="mb-3 text-sm font-semibold text-gray-700">
          Productivity Trend
        </h3>

        <ProductivityChart data={data?.trend || []} />
      </div>
    </div>
  );
}

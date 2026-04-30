/** @format */

import { getOverview } from "@/features/employee/service/employeeReports.service";
import { useEffect, useRef, useState } from "react";

/* ============================== */
/* 📦 TYPES                       */
/* ============================== */

interface Totals {
  active: number;
  idle: number;
  away: number;
}

interface TrendItem {
  date: string;
  total: number;
}

interface ReportData {
  totals: Totals;
  apps: Record<string, number>;
  trend: TrendItem[];
  productivity: number;
}

/* ============================== */
/* 🔥 HOOK                        */
/* ============================== */

export const useEmployeeReports = () => {
  const [data, setData] = useState<ReportData>({
    totals: { active: 0, idle: 0, away: 0 },
    apps: {},
    trend: [],
    productivity: 0,
  });

  const [loading, setLoading] = useState(true);

  // 🔥 prevent unnecessary updates
  const firstLoad = useRef(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getOverview();
        if (!res) return;

        setData((prev) => {
          /* ============================== */
          /* 🔥 MERGE LOGIC (IMPORTANT)     */
          /* ============================== */

          const mergedApps = { ...prev.apps };

          for (const key in res.apps) {
            mergedApps[key] = Math.max(
              mergedApps[key] || 0,
              res.apps[key]
            );
          }

          return {
            totals: {
              active: Math.max(prev.totals.active, res.totals.active),
              idle: Math.max(prev.totals.idle, res.totals.idle),
              away: Math.max(prev.totals.away, res.totals.away),
            },

            apps: mergedApps,

            // trend can be replaced (server is source of truth)
            trend: res.trend,

            productivity: res.productivity,
          };
        });

      } catch (err) {
        console.error("Reports Error:", err);
      } finally {
        if (firstLoad.current) {
          setLoading(false);
          firstLoad.current = false;
        }
      }
    };

    /* ============================== */
    /* 🚀 INITIAL FETCH               */
    /* ============================== */

    fetch();

    /* ============================== */
    /* 🔄 AUTO REFRESH (5 MIN)        */
    /* ============================== */

    const interval = setInterval(fetch, 300000);

    return () => clearInterval(interval);
  }, []);

  return {
    loading,
    totals: data.totals,
    apps: data.apps,
    trend: data.trend,
    productivity: data.productivity,
  };
};

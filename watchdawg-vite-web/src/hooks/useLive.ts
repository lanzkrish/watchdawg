/** @format */

import { useAdminStore } from "@/store/admin.store";
import { useEffect, useState } from "react";
import { useAdminSocket } from "../features/admin/hooks/useAdminSocket";

export const useLive = () => {
  const data = useAdminStore((s) => s.data);

  const [loading, setLoading] = useState(true);

  /* ============================== */
  /* 🔥 INIT SOCKET (ONCE)          */
  /* ============================== */

  useAdminSocket(); // ✅ must be called at top level

  /* ============================== */
  /* 🔥 LOADING CONTROL             */
  /* ============================== */

  useEffect(() => {
    if (data !== null) {
      setLoading(false);
    }
  }, [data]);

  /* ============================== */
  /* 🔥 SAFE DATA (NO CRASH)        */
  /* ============================== */

  const safeEmployees = data?.employeeActivity ?? [];
  const safeFeed = data?.activityFeed ?? [];

  /* ============================== */
  /* 🔥 DEBUG (IMPORTANT)           */
  /* ============================== */

  useEffect(() => {
    console.log("📡 [LIVE HOOK] Employees:", safeEmployees.length);
    console.log("📡 [LIVE HOOK] Feed:", safeFeed.length);
  }, [safeEmployees, safeFeed]);

  return {
    data: {
      liveEmployees: safeEmployees,
      activityFeed: safeFeed,
    },
    loading,
  };
};

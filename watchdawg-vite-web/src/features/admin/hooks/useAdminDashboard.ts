/** @format */

import { getAdminDashboard } from "@/services/adminDashboard.service";
import { useAdminStore } from "@/store/admin.store";
import { useEffect, useRef, useState } from "react";

export const useAdminDashboard = (token?: string) => {
  const setBulkActivities = useAdminStore(
    (s) => s.setBulkActivities
  );

  const lastUpdated = useAdminStore(
    (s) => s.lastUpdated
  );

  const [loading, setLoading] = useState(true);

  const hasFetched = useRef(false);

  useEffect(() => {
    if (!token) {
      console.warn("⚠️ No token → skip admin fetch");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        console.log("📡 Fetching initial admin activities...");

        const activities = await getAdminDashboard(token);

        if (activities.length > 0) {
          setBulkActivities(activities);
        }

      } catch (err) {
        console.error("❌ Admin Dashboard Fetch Error:", err);
      } finally {
        setLoading(false);
        hasFetched.current = true;
      }
    };

    /* ============================== */
    /* 🔥 SMART FETCH (HYDRATION ONLY)*/
    /* ============================== */

    const isStale =
      !lastUpdated || Date.now() - lastUpdated > 60000;

    if (!hasFetched.current && isStale) {
      fetchData();
    } else {
      setLoading(false);
    }

  }, [token]);

  return { loading };
};

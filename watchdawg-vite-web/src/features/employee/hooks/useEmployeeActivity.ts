/** @format */

import { useEffect, useRef, useState } from "react";

import { getMyActivity } from "@/services/employeeActivity.service";
import { useApiActivityStore } from "@/store/apiActivity.store";

export const useActivity = () => {
  const {
    data,
    setData,
    setLoading,
    setError,
    lastFetched,
    cooldown,
    setCooldown,
  } = useApiActivityStore();

  const [loading, setLocalLoading] = useState(data.length === 0);

  const isFetching = useRef(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetch = async () => {
      if (isFetching.current) return;

      /* 🔒 Respect cooldown */
      if (cooldown > 0) {
        console.log("⏳ Cooldown active:", cooldown);
        return;
      }

      isFetching.current = true;

      try {
        abortRef.current?.abort();
        const controller = new AbortController();
        abortRef.current = controller;

        console.log("📡 Fetching activity (API)...");

        setLoading(true);

        const res = await getMyActivity(); // ✅ no args

        if (!res) return;

        const { data: activityData, cooldown, skipped } = res;

        /* ============================== */
        /* ⏳ COOLDOWN                    */
        /* ============================== */

        if (cooldown) {
          setCooldown(cooldown);
          return;
        }

        if (skipped || !activityData) return;

        /* ============================== */
        /* 🔥 REPLACE DATA (SOURCE OF TRUTH) */
        /* ============================== */

        if (isMounted) {
          setData(activityData); // ✅ already normalized in service
          setCooldown(0);
        }

        console.log("✅ Activity updated:", activityData.length);
      } catch (err: any) {
        if (err.name !== "AbortError") {
          console.error("❌ Activity Error:", err);
          setError(err.message);
        }
      } finally {
        isFetching.current = false;

        if (isMounted) {
          setLoading(false);
          setLocalLoading(false);
        }
      }
    };

    /* ============================== */
    /* 🚀 INITIAL LOAD                */
    /* ============================== */

    const isStale = Date.now() - lastFetched > 15000;

    if (data.length === 0 || isStale) {
      fetch();
    } else {
      setLocalLoading(false);
    }

    /* ============================== */
    /* 🔁 AUTO REFRESH                */
    /* ============================== */

    const interval = setInterval(fetch, 15000);

    return () => {
      isMounted = false;
      clearInterval(interval);
      abortRef.current?.abort();
    };
  }, []);

  return { data, loading: loading || data.length === 0 };
};

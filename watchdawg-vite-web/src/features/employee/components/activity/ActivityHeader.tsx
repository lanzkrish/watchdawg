/** @format */

import { useApiActivityStore } from "@/store/apiActivity.store";
import { useEffect, useState } from "react";

export default function ActivityHeader() {
  const { cooldown, lastFetched } = useApiActivityStore();

  const [seconds, setSeconds] = useState(15);

  /* ============================== */
  /* ⏱ SMART TIMER (SYNC WITH API)  */
  /* ============================== */

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();

      const elapsed = Math.floor((now - lastFetched) / 1000);
      const remaining = Math.max(15 - elapsed, 0);

      setSeconds(remaining === 0 ? 15 : remaining);
    }, 1000);

    return () => clearInterval(interval);
  }, [lastFetched]);

  /* ============================== */
  /* 🚀 UI                          */
  /* ============================== */

  return (
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold">My Activity</h1>

      <div
        className={`text-xs px-3 py-1 rounded-full transition-all duration-200 ${
          cooldown > 0
            ? "bg-red-500/20 text-red-400"
            : "bg-blue-500/20 text-blue-400"
        }`}
      >
        {cooldown > 0
          ? `🚫 Cooldown ${cooldown}s`
          : `⏳ Sync in ${seconds}s`}
      </div>
    </div>
  );
}

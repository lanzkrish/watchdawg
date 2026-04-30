/** @format */

import { useAdminStore } from "@/store/admin.store";
import { formatDuration } from "@/utils/formatDuration";
import { getAppIcon } from "@/utils/getAppIcon";
import { useMemo } from "react";

export default function EmployeeLiveCard({ user }: any) {
  /* 🔥 TRIGGER RE-RENDER */
  const tick = useAdminStore((s) => s.lastUpdated);

  /* ✅ LIVE TIMER */
  const duration = useMemo(() => {
    if (!user?.timestamp) return "0s";

    const seconds = Math.floor((Date.now() - user.timestamp) / 1000);
    return formatDuration(seconds);
  }, [user.timestamp, tick]);

  /* ============================== */
  /* 🎨 STATUS STYLE                */
  /* ============================== */

  const getStatusStyle = (status: string) => {
    if (status === "active") {
      return {
        dot: "bg-green-400",
        text: "text-green-400",
        label: "Active",
      };
    }

    if (status === "idle") {
      return {
        dot: "bg-yellow-400",
        text: "text-yellow-400",
        label: "Idle",
      };
    }

    return {
      dot: "bg-red-400",
      text: "text-red-400",
      label: "Away",
    };
  };

  const status = getStatusStyle(user.status);

  return (
    <div
      className={`flex justify-between items-center px-4 py-3 rounded-lg transition
      ${
        user.status === "active"
          ? "bg-green-500/5 shadow-[0_0_10px_rgba(34,197,94,0.1)]"
          : "hover:bg-white/5"
      }`}
    >
      {/* LEFT */}
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-sm font-semibold">
          {user.name?.charAt(0) || "U"}
        </div>

        {/* Info */}
        <div>
          <p className="text-sm text-white">
            {user.name || "Unknown"}
          </p>

          <div className="flex items-center gap-2 text-xs text-gray-400">
            {getAppIcon(user.app)}
            <span>{user.app || "Working"}</span>
            <span>•</span>
            <span className="truncate max-w-[200px]">
              {user.title || "Working..."}
            </span>
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">
        {/* STATUS */}
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${status.dot}`} />
          <span className={`text-xs font-medium ${status.text}`}>
            {status.label}
          </span>
        </div>

        {/* 🔥 TIMER */}
        <span className="text-xs font-mono text-gray-300 min-w-[60px] text-right">
          {duration}
        </span>
      </div>
    </div>
  );
}

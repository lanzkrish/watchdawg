/** @format */

import { formatTime } from "@/utils/getFormat";

/* ============================== */
/* 🧩 TYPES (EXPORTED)            */
/* ============================== */

export type ActivityRowItem = {
  id: string;

  app: string;
  title?: string;

  platform?: string;
  category: "productive" | "neutral" | "distracting";

  status: "active" | "idle" | "away";

  timestamp: number;
  duration: number;

  background: {
    platform: string;
    category: "productive" | "neutral" | "distracting";
    duration: number;
  } | null;

  isLive?: boolean;
};

interface Props {
  item: ActivityRowItem;
}

/* ============================== */
/* 🎨 STYLE HELPERS               */
/* ============================== */

const categoryStyle = {
  productive: "bg-green-500/10 text-green-400",
  neutral: "bg-gray-500/10 text-gray-400",
  distracting: "bg-red-500/10 text-red-400",
};

const statusStyle = {
  active: "bg-green-500/20 text-green-400",
  idle: "bg-yellow-500/20 text-yellow-400",
  away: "bg-red-500/20 text-red-400",
};

/* ============================== */
/* 🧩 COMPONENT                   */
/* ============================== */

export default function ActivityRow({ item }: Props) {
  const isLive = item.isLive;

  return (
    <div
      className={`
        flex flex-col gap-3
        px-5 py-4 rounded-xl border transition-all duration-300

        ${
          isLive
            ? "bg-green-500/5 border-green-500/20 shadow-[0_0_20px_rgba(34,197,94,0.1)]"
            : "bg-[#0f172a] border-white/5 hover:bg-[#1e293b]/60"
        }
      `}
    >
      {/* 🔹 TOP */}
      <div className="flex justify-between items-center">

        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-white">
              {item.app}
            </p>

            {isLive && (
              <span className="text-[9px] px-2 py-[2px] rounded bg-green-500/20 text-green-400">
                LIVE
              </span>
            )}
          </div>

          <p className="text-xs text-gray-400 truncate max-w-[300px]">
            {item.title || "No title"}
          </p>

          <div className="flex gap-2 mt-1 text-[10px] text-gray-500">
            <span>{item.platform || "Unknown"}</span>
            <span>•</span>

            <span className={`px-2 py-[1px] rounded ${categoryStyle[item.category]}`}>
              {item.category}
            </span>
          </div>
        </div>

        <span className={`px-2 py-1 rounded-full text-xs ${statusStyle[item.status]}`}>
          {item.status}
        </span>
      </div>

      {/* 🔥 BACKGROUND */}
      {item.background && (
        <div className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2">
          <div className="flex items-center gap-2 text-xs text-gray-300">
            <span>🎵</span>

            <span>{item.background.platform}</span>
            <span className="text-gray-500">•</span>

            <span className={categoryStyle[item.background.category]}>
              {item.background.category}
            </span>
          </div>

          <span className="text-xs font-mono text-gray-300">
            {item.background.duration}s
          </span>
        </div>
      )}

      {/* 🔹 FOOTER */}
      <div className="flex justify-between text-xs text-gray-500">
        <span>{formatTime(item.timestamp)}</span>

        <span className="font-mono text-white">
          {item.duration}s
        </span>
      </div>
    </div>
  );
}

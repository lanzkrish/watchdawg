/** @format */

import { formatTime } from "@/utils/time";

/* ============================== */
/* 🎨 HELPERS                     */
/* ============================== */

const categoryStyle = {
  productive:
    "bg-green-500/10 text-green-400 border border-green-500/20",
  distracting:
    "bg-red-500/10 text-red-400 border border-red-500/20",
  neutral:
    "bg-gray-500/10 text-gray-400 border border-gray-500/20",
};

const statusDot = {
  active: "bg-green-400",
  idle: "bg-yellow-400",
  away: "bg-red-400",
};

/* ============================== */
/* 🧩 TYPES                       */
/* ============================== */

interface Session {
  id: string;
  app: string;
  title: string;
  platform?: string;

  startTime: number;
  endTime?: number;

  durations: {
    active: number;
    idle: number;
    away: number;
  };

  category?: "productive" | "distracting" | "neutral";
}

interface Props {
  session: Session;
  isLive?: boolean;
}

/* ============================== */
/* 🧩 COMPONENT                   */
/* ============================== */

export default function SessionItem({ session, isLive }: Props) {
  const { active, idle, away } = session.durations;

  const total = active + idle + away;

  /* 🔥 FIXED: LIVE PRIORITY */
  const dominantStatus = isLive
    ? "active"
    : active >= idle && active >= away
    ? "active"
    : idle >= away
    ? "idle"
    : "away";

  return (
    <div
      className={`
        group flex justify-between items-center
        ${isLive ? "p-3.5" : "p-3"}
        rounded-xl border backdrop-blur-sm
        transition-all duration-300

        ${
          isLive
            ? "border-green-500/30 bg-green-500/5 shadow-[0_0_20px_rgba(34,197,94,0.12)]"
            : "border-white/5 bg-[#0f172a]/40 opacity-80 hover:opacity-100 hover:bg-[#1e293b]/60 hover:border-white/10"
        }
      `}
    >
      {/* LEFT */}
      <div className="flex items-center gap-3 min-w-0">

        {/* STATUS DOT */}
        <div className="relative flex-shrink-0">
          <div
            className={`
              w-2 h-2 rounded-full
              ${statusDot[dominantStatus]}
              ${!isLive ? "opacity-70" : ""}
            `}
          />
          {isLive && (
            <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-30" />
          )}
        </div>

        {/* TEXT */}
        <div className="min-w-0">

          {/* APP + LIVE */}
          <div className="flex items-center gap-2">

            <p className="text-sm font-semibold text-white truncate">
              {session.app}
            </p>

            {isLive && (
              <span className="text-[9px] px-2 py-[2px] font-semibold rounded bg-green-500/20 text-green-400 border border-green-500/30 uppercase tracking-wider">
                LIVE
              </span>
            )}
          </div>

          {/* TITLE */}
          <p className="text-[11px] text-gray-400 truncate max-w-[200px]">
            {session.title}
          </p>

          {/* META */}
          <div className="flex items-center gap-2 mt-1 text-[9px]">

            <span className="text-gray-500">
              {session.platform || "Unknown"}
            </span>

            <span className="text-gray-600">•</span>

            <span
              className={`px-1.5 py-[1px] rounded capitalize ${
                categoryStyle[session.category ?? "neutral"]
              }`}
            >
              {session.category ?? "neutral"}
            </span>
          </div>

          {/* 🔥 STATE BREAKDOWN */}
          <div className="flex gap-3 mt-1 text-[9px] font-mono">

            <span className="text-green-400">
              A: {formatTime(active)}
            </span>

            <span className="text-yellow-400">
              I: {formatTime(idle)}
            </span>

            <span className="text-red-400">
              W: {formatTime(away)}
            </span>

          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="text-right flex flex-col items-end gap-1">

        {/* TIME */}
        <span className="text-[10px] text-gray-500">
          {new Date(session.startTime).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>

        {/* TOTAL */}
        <span className="text-sm font-mono text-white tracking-wide">
          {formatTime(total)}
        </span>

      </div>
    </div>
  );
}

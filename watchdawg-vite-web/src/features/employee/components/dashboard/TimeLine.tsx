/** @format */

import { useActivityStore } from "@/store/activity.store";
import { useNavigate } from "react-router-dom";
import SessionItem from "./SessionItem";

/* ============================== */
/* 🧠 GROUP BY DATE               */
/* ============================== */

function groupByDate(sessions: any[]) {
  const groups: Record<string, any[]> = {};

  sessions.forEach((s) => {
    const date = new Date(s.startTime).toDateString();

    if (!groups[date]) groups[date] = [];
    groups[date].push(s);
  });

  return groups;
}

/* ============================== */
/* 🧩 COMPONENT                   */
/* ============================== */

export default function TimeLine() {
  const navigate = useNavigate();

  const sessions = useActivityStore((s) => s.sessions);
  const currentSession = useActivityStore((s) => s.currentSession);

  /* ============================== */
  /* 🔥 COMBINE SAFELY             */
  /* ============================== */

  const allSessions = [
    ...(currentSession ? [currentSession] : []), // ✅ LIVE FIRST
    ...sessions,
  ];

  /* ============================== */
  /* 🔥 SORT                       */
  /* ============================== */

  const sorted = [...allSessions].sort(
    (a, b) => b.startTime - a.startTime
  );

  /* ============================== */
  /* 🔥 LIMIT                      */
  /* ============================== */

  const limited = sorted.slice(0, 4);

  const grouped = groupByDate(limited);
  const dates = Object.keys(grouped);

  return (
    <div className="bg-[#0f172a] p-4 rounded border border-gray-800">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm text-gray-400">Activity Timeline</h3>

        <button
          onClick={() => navigate("/employee/activity")}
          className="text-xs text-blue-400"
        >
          View All →
        </button>
      </div>

      {/* CONTENT */}
      <div className="space-y-4">

        {dates.length > 0 ? (
          dates.map((date) => (
            <div key={date}>

              {/* DATE */}
              <p className="text-xs text-gray-500 mb-2">
                {formatDateLabel(date)}
              </p>

              {/* SESSIONS */}
              <div className="space-y-2">
                {grouped[date].map((s, i) => (
                  <SessionItem
                    key={s.id}
                    session={s}
                    isLive={!s.endTime && i === 0}
                  />
                ))}
              </div>

            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm">
            No activity yet
          </p>
        )}

      </div>
    </div>
  );
}

/* ============================== */
/* 🧠 DATE LABEL                  */
/* ============================== */

function formatDateLabel(dateStr: string) {
  const date = new Date(dateStr);
  const today = new Date();

  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";

  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
  });
}

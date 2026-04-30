/** @format */

import { useMemo } from "react";
import type { ActivityRowItem } from "./ActivityRows";
import ActivityRow from "./ActivityRows";

import type {
  Activity,
  LiveActivity,
} from "@/types/employeeDashboard.types";

/* ============================== */
/* 🧩 TYPES                       */
/* ============================== */

interface Props {
  live: LiveActivity | null;
  history: Activity[];
}

/* ============================== */
/* 🧠 COMPONENT                   */
/* ============================== */

export default function ActivityList({ live, history }: Props) {
  /* ============================== */
  /* 🔥 LIVE ROW                   */
  /* ============================== */

  const liveRow: ActivityRowItem | null = useMemo(() => {
    if (!live || live.duration <= 0) return null;

    return {
      id: "live",

      app: live.app,
      title: live.title,

      platform: live.platform ?? "Unknown",
      category: live.category,

      status: live.status,

      timestamp: live.timestamp,
      duration: live.duration,

      background: live.background ?? null,

      isLive: true,
    };
  }, [live]);

  /* ============================== */
  /* 📊 HISTORY ROWS               */
  /* ============================== */

  const historyRows: ActivityRowItem[] = useMemo(() => {
    return history.map((item, index) => ({
      id: `${item.timestamp}-${item.app}-${index}`,

      app: item.app,
      title: item.title,

      platform: item.platform ?? "Unknown",
      category: item.category,

      status: item.status,

      timestamp: item.timestamp,
      duration: item.duration,

      background: item.background ?? null,

      isLive: false,
    }));
  }, [history]);

  /* ============================== */
  /* 🔗 MERGE                      */
  /* ============================== */

  const rows: ActivityRowItem[] = useMemo(() => {
    if (liveRow) {
      return [liveRow, ...historyRows];
    }
    return historyRows;
  }, [liveRow, historyRows]);

  /* ============================== */
  /* 🎯 EMPTY STATE                */
  /* ============================== */

  if (rows.length === 0) {
    return (
      <div className="text-gray-500 text-center py-12">
        No activity yet
      </div>
    );
  }

  /* ============================== */
  /* 🚀 UI                         */
  /* ============================== */

  return (
    <div className="space-y-3">
      {rows.map((row) => (
        <ActivityRow key={row.id} item={row} />
      ))}
    </div>
  );
}

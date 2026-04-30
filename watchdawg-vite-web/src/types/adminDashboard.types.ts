/** @format */

/* ===================================== */
/* 🔥 SHARED ENUMS (PRODUCTION SAFE)     */
/* ===================================== */

export type ActivityStatus = "active" | "idle" | "away";

export type ActivityCategory =
  | "productive"
  | "distracting"
  | "neutral";

/**
 * 🔥 SOURCE = ORIGIN (NOT TRANSPORT)
 */
export type ActivitySource =
  | "agent"      // desktop tracker
  | "extension"  // browser extension
  | "system";    // backend generated (future)

/* ===================================== */
/* 🧠 CORE ACTIVITY (SINGLE SOURCE)      */
/* ===================================== */

export interface Activity {
  userId: string;
  organizationId: string;

  /* 👤 USER */
  name: string; // ✅ always resolved in backend

  /* 🧠 APP */
  app: string;
  title: string;

  /* 🌐 PLATFORM */
  platform: string;
  category: ActivityCategory;

  /* 📊 STATE */
  status: ActivityStatus;
  duration: number; // seconds

  /* ⏱ TIME */
  timestamp: number;

  /* 🔌 SOURCE */
  source: ActivitySource;

  /* 🎵 BACKGROUND (MATCH BACKEND) */
  background?: {
    app: string;
    type: string; // "music" (extensible)
    duration: number;
  } | null;

  /* 🔥 LIVE CONTROL (CRITICAL) */
  lastUpdated?: number; // ✅ REQUIRED
}

/* ===================================== */
/* ⚡ LIVE MAP (ADMIN SIDE)              */
/* ===================================== */

export type LiveActivityMap = Record<string, Activity>;

/* ===================================== */
/* 📊 DERIVED STATS                     */
/* ===================================== */

export interface AdminStats {
  totalUsers: number;

  active: number;
  idle: number;
  away: number;

  productive: number;
  distracting: number;
  neutral: number;

  productivityScore: number; // %
}

/* ===================================== */
/* 📈 TREND (FUTURE READY)              */
/* ===================================== */

export interface ProductivityPoint {
  date: string;
  productive: number;
  distracting: number;
  neutral: number;
}

/* ===================================== */
/* 📜 ACTIVITY FEED                     */
/* ===================================== */

export interface ActivityFeedItem {
  id: string;

  userId: string;
  name: string;

  message: string;
  timestamp: number;
}

/* ===================================== */
/* 📊 FINAL ADMIN DASHBOARD STATE        */
/* ===================================== */

export interface AdminDashboardState {
  /* 🔥 LIVE (PRIMARY SOURCE) */
  liveActivities: LiveActivityMap;

  /* 📊 DERIVED */
  stats: AdminStats;

  /* 📈 OPTIONAL */
  trend?: ProductivityPoint[];

  /* 📜 OPTIONAL */
  activityFeed: ActivityFeedItem[]; // ✅ not optional
}

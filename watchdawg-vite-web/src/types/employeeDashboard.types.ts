/** @format */

/* ===================================== */
/* 🔥 CORE ENUMS                         */
/* ===================================== */

export type ActivityStatus = "active" | "idle" | "away";

export type ActivityCategory =
  | "productive"
  | "distracting"
  | "neutral";

export type ActivitySource = "agent" | "extension";

/* ===================================== */
/* 🧠 CORE ACTIVITY (SINGLE SOURCE)      */
/* ===================================== */

export interface Activity {
  userId: string;
  organizationId: string;

  /* 👤 USER */
  name?: string;

  /* 🧠 PRIMARY APP (ALWAYS TRUST THIS) */
  app: string; // ✅ MAIN DISPLAY SOURCE (VS Code, Chrome)

  /* 📝 CONTEXT */
  title?: string;   // file name / tab name
  platform?: string; // site/app detail (YouTube, GitHub)

  /* 📊 CLASSIFICATION */
  category: ActivityCategory;
  status: ActivityStatus;

  /* ⏱ TIME */
  duration: number;
  timestamp: number;

  /* 🔌 SOURCE */
  source: ActivitySource;

  /* 🎵 BACKGROUND */
  background?: {
    platform: string;
    category: ActivityCategory;
    duration: number;
  } | null;
}

/* ===================================== */
/* ⚡ LIVE ACTIVITY (REALTIME SAFE)       */
/* ===================================== */

export interface LiveActivity extends Activity {
  lastUpdated?: number; // ✅ prevents stale UI
}

/* ===================================== */
/* 📊 STATS (DERIVED ONLY)               */
/* ===================================== */

export interface Stats {
  totalTime: number;

  productiveTime: number;
  distractingTime: number;
  neutralTime: number;

  productivityScore: number; // %
}

/* ===================================== */
/* 📈 TREND                              */
/* ===================================== */

export interface TrendPoint {
  date: string;

  productive: number;
  distracting: number;
  neutral: number;
}

/* ===================================== */
/* 📊 APP USAGE                          */
/* ===================================== */

export interface AppUsage {
  app: string; // ✅ unified naming
  duration: number;
  percentage: number;
}

/* ===================================== */
/* 📜 ACTIVITY FEED                      */
/* ===================================== */

export interface ActivityFeedItem {
  id: string;

  userId: string;
  name?: string;

  app: string;
  title?: string;

  status: ActivityStatus;
  category: ActivityCategory;

  timestamp: number;
  duration: number;
}

/* ===================================== */
/* 📊 DASHBOARD STATE                    */
/* ===================================== */

export interface EmployeeDashboardData {
  live: LiveActivity | null;

  stats: Stats;
  trend: TrendPoint[];

  apps: AppUsage[];
  activity: ActivityFeedItem[];
}

/* ===================================== */
/* 📋 TASK SYSTEM                        */
/* ===================================== */

export type TaskStatus =
  | "pending"
  | "in-progress"
  | "completed";

export type TaskPriority =
  | "low"
  | "medium"
  | "high";

export interface Task {
  id: string;

  userId: string;
  organizationId: string;

  title: string;
  description?: string;

  status: TaskStatus;
  priority: TaskPriority;

  progress: number;

  createdAt: number;
  updatedAt: number;
  deadline?: number;

  assignedBy?: string;

  lastUpdated?: number;
}

/* ===================================== */
/* 📊 TASK SUMMARY                       */
/* ===================================== */

export interface TaskSummary {
  total: number;
  completed: number;
  pending: number;
  inProgress: number;
}

/* ===================================== */
/* 📡 SOCKET EVENTS                      */
/* ===================================== */

export interface TaskSocketEvent {
  type: "task_created" | "task_updated" | "task_deleted";
  task: Task;
}

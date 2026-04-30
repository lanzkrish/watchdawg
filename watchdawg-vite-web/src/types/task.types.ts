/** @format */

/* ================================================= */
/* 🧠 ENUM TYPES                                     */
/* ================================================= */

export type TaskStatus =
  | "todo"
  | "in_progress"
  | "completed";

export type TaskPriority =
  | "low"
  | "medium"
  | "high";

/* ================================================= */
/* 👥 ASSIGNEE (REUSABLE TYPE)                       */
/* ================================================= */

export type TaskAssignee = {
  userId: string;
  name: string;

  status: TaskStatus;
  progress: number;

  assigned_at?: string;
  started_at?: string;
  completed_at?: string;
};

/* ================================================= */
/* 👑 ADMIN VIEW                                     */
/* ================================================= */

export type Task = {
  id: string;

  title: string;
  description?: string;

  priority: TaskPriority;
  status: TaskStatus;

  deadline?: string;

  created_at?: string;
  updated_at?: string;

  progress?: number; // 🔥 global task progress (if used)

  assignees: TaskAssignee[];
};

/* ================================================= */
/* 👤 EMPLOYEE VIEW                                  */
/* ================================================= */

export type EmployeeTask = {
  id: string;

  title: string;
  description?: string;

  priority: TaskPriority;

  deadline?: string;

  /* 🔥 PERSONAL STATE */
  my_status: TaskStatus;
  my_progress: number;

  assigned_at?: string;
  started_at?: string;
  completed_at?: string;
};

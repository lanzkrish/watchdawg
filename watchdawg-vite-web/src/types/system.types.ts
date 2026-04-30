/** @format */

export interface Ticket {
  id: number;
  title: string;
  status: "open" | "resolved";
  createdAt: string;
}

export interface Issue {
  id: number;
  type: string;
  message: string;
  status: "open" | "resolved";
  time: string;
}

export interface Log {
  id: number;
  message: string;
  level: "info" | "warning" | "success";
  time: string;
}

export interface SystemData {
  tickets: Ticket[];
  issues: Issue[];
  logs: Log[];
}

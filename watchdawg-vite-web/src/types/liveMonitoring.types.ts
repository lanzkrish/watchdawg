/** @format */

export type EmployeeActivity = {
  userId: string;
  name: string;

  app: string;
  title: string;

  status: "active" | "idle" | "away";
  category: "productive" | "neutral" | "distracting";

  platform: string;
  timestamp: number;

  team?: string; // optional grouping
};

import type { Activity } from "./adminDashboard.types";

export type SocketActivityUpdate = Partial<Activity> & {
  userId: string;
};

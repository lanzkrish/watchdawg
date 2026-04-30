/** @format */

import type { LiveData } from "@/types/liveMonitoring.types";
import { api } from "./api";

export const getLiveData = async (): Promise<LiveData> => {
  const res = await api.get("/admin/live"); // 🔥 interceptor adds token
  return res.data;
};

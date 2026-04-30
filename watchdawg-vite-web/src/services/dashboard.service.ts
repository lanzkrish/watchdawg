/** @format */

import type { DashboardData } from "../types/dashboard.types";
import { api } from "./api";

export const getDashboardData = async (
  token: string
): Promise<DashboardData> => {
  const res = await api.get<DashboardData>("/super-admin/dashboard", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

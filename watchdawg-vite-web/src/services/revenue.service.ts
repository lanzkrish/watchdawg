/** @format */

import type { RevenueData } from "@/types/revenue.types";
import { api } from "./api";



export const getRevenue = async (
  token: string
): Promise<RevenueData> => {
  const res = await api.get<RevenueData>(
    `/super-admin/revenue`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

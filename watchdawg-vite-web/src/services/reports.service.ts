/** @format */

import type { ReportItem } from "@/types/reports.types";
import { api } from "./api";

export const getReports = async (): Promise<ReportItem[]> => {
  const res = await api.get("/admin/reports");
  return res.data;
};

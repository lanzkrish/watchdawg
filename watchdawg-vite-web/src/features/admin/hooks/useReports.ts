/** @format */

import { getReports } from "@/services/reports.service";
import type { ReportItem } from "@/types/reports.types";
import { useEffect, useState } from "react";

export const useReports = () => {
  const [data, setData] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await getReports();
        setData(res);
      } catch (err) {
        console.error("Reports Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  return { data, loading };
};

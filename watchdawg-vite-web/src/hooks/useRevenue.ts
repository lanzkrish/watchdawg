/** @format */

import { getRevenue } from "@/services/revenue.service";
import { useRevenueStore } from "@/store/revenue.store";
import type { RevenueData } from "@/types/revenue.types";
import { useEffect } from "react";

export const useRevenue = (token: string) => {
  const { data, loading, setData, setLoading } = useRevenueStore();

  useEffect(() => {
    if (!token) return;

    const fetchRevenue = async () => {
      try {
        setLoading(true);

        const res: RevenueData = await getRevenue(token);

        setData(res);
      } catch (err) {
        console.error("Revenue fetch error:", err);
        setData(null as any); // optional reset
      }
    };

    fetchRevenue();
  }, [token]);

  return {
    data,
    loading,
  };
};

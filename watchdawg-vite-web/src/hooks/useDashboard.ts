/** @format */

import { useEffect } from "react";
import { getDashboardData } from "../services/dashboard.service";
import { useDashboardStore } from "../store/dashboard.store";

export const useDashboard = (token: string) => {
  const { data, loading, error, setData, setLoading, setError } =
    useDashboardStore();

  /** @format */

useEffect(() => {
  console.log("TOKEN:", token);

  if (!token) {
    console.log("No token found ❌");
    return;
  }

  const fetchData = async () => {
    try {
      setLoading(true);

      console.log("Calling API...");

      const res = await getDashboardData(token);

      console.log("API RESPONSE:", res);

      setData(res);
    } catch (err: any) {
      console.log("ERROR:", err);
      setError(err.message);
    }
  };

  fetchData();
}, [token]);

  return { data, loading, error };
};

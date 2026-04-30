/** @format */

import { create } from "zustand";
import type { DashboardData } from "../types/dashboard.types";

interface DashboardState {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;

  setLoading: (loading: boolean) => void;
  setData: (data: DashboardData) => void;
  setError: (error: string) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  data: null,
  loading: false,
  error: null,

  setLoading: (loading) => set({ loading }),
  setData: (data) => set({ data, loading: false, error: null }),
  setError: (error) => set({ error, loading: false }),
}));

/** @format */

import type { RevenueData } from "@/types/revenue.types";
import { create } from "zustand";

interface RevenueState {
  data: RevenueData | null;
  loading: boolean;

  setData: (data: RevenueData | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useRevenueStore = create<RevenueState>((set) => ({
  data: null,
  loading: false,

  setData: (data) => set({ data, loading: false }),
  setLoading: (loading) => set({ loading }),
}));

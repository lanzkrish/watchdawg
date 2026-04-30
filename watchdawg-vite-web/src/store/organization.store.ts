/** @format */

import type { Organization } from "@/types/organization.types";
import { create } from "zustand";

interface OrgState {
  data: Organization[];
  loading: boolean;

  setData: (data: Organization[]) => void;
  setLoading: (loading: boolean) => void;
}

export const useOrgStore = create<OrgState>((set) => ({
  data: [],
  loading: false,

  setData: (data) => set({ data, loading: false }),
  setLoading: (loading) => set({ loading }),
}));

/** @format */

import type { SettingsData } from "@/types/settings.types";
import { api } from "./api";

export const getSettings = async (token: string) => {
  const res = await api.get("/super-admin/settings", {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data.data;
};

export const updateSettings = async (
  token: string,
  data: SettingsData
) => {
  const res = await api.post("/super-admin/settings", data, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data;
};

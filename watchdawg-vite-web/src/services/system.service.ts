import type { SystemData } from "@/types/system.types";
import { api } from "./api";


export const getSystemData = async (token: string): Promise<SystemData> => {
  const res = await api.get(`/super-admin/system`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data;
};

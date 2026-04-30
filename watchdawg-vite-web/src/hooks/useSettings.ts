/** @format */

import { getSettings, updateSettings } from "@/services/settings.service";
import { useEffect, useState } from "react";

export const useSettings = (token: string) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetch = async () => {
    setLoading(true);
    const res = await getSettings(token);
    setData(res);
    setLoading(false);
  };

  const save = async (payload: any) => {
    await updateSettings(token, payload);
    await fetch();
  };

  useEffect(() => {
    if (!token) return;
    fetch();
  }, [token]);

  return { data, loading, save };
};

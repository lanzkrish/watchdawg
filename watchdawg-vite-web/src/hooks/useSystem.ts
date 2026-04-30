import { getSystemData } from "@/services/system.service";
import { useEffect, useState } from "react";

export const useSystem = (token: string) => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (!token) return;

    getSystemData(token).then(setData);
  }, [token]);

  return data;
};

/** @format */

import { getOrganizations } from "@/services/organization.service";
import { useOrgStore } from "@/store/organization.store";
import { useEffect } from "react";

export const useOrganizations = (token: string) => {
  const { data, setData, loading, setLoading } = useOrgStore();

  useEffect(() => {
    if (!token) return;

    const fetch = async () => {
      setLoading(true);
      const res = await getOrganizations(token);
      setData(res);
    };

    fetch();
  }, [token]);

  return { data, loading };
};

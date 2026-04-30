/** @format */

import type { Organization } from "@/types/organization.types";
import { api } from "./api";

export const getOrganizations = async (
  token: string
): Promise<Organization[]> => {
  const res = await api.get(`/super-admin/organizations`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

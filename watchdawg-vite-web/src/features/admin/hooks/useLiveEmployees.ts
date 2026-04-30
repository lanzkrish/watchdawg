/** @format */

import { useAdminStore } from "@/store/admin.store";

export const useLiveEmployees = () => {
  return useAdminStore((s) =>
    Object.values(s.liveActivities)
  );
};

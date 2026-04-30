/** @format */

import { groupEmployees } from "@/utils/groupEmployees";
import { useMemo } from "react";

export const useGroupedEmployees = (employees: any[]) => {
  return useMemo(() => groupEmployees(employees), [employees]);
};

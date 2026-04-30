/** @format */

import type { EmployeeActivity } from "../types/liveMonitoring.types";

export const groupEmployees = (employees: EmployeeActivity[]) => {
  const groups: Record<string, EmployeeActivity[]> = {};

  employees.forEach((emp) => {
    const group = emp.team || "General";

    if (!groups[group]) {
      groups[group] = [];
    }

    groups[group].push(emp);
  });

  return groups;
};

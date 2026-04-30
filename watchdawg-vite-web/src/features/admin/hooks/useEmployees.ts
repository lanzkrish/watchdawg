/** @format */

import { useEmployeeStore } from "@/store/employee.store";
import { useEffect } from "react";

export const useEmployees = () => {
  const {
    employees,
    fetchEmployees,
    createEmployee,
    toggleAccess,
    deleteEmployee,
  } = useEmployeeStore();

  /* 🔄 AUTO FETCH */
  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  return {
    employees,

    /* actions */
    createEmployee,
    toggleAccess,
    deleteEmployee,
    refresh: fetchEmployees,
  };
};

/** @format */

import {
    createEmployee,
    deleteEmployee,
    getEmployees,
    toggleAccess,
} from "@/services/employee.service";
import { useAdminStore } from "@/store/admin.store";
import type { Employee } from "@/types/employee.types";
import { useEffect, useState } from "react";

export const useEmployees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  /* ============================== */
  /* 🔥 LIVE DATA FROM SOCKET       */
  /* ============================== */

  const liveData = useAdminStore((s) => s.data);

  /* ============================== */
  /* 📥 FETCH FROM API              */
  /* ============================== */

  const fetchEmployees = async () => {
    try {
      const res = await getEmployees();
      setEmployees(res);
    } catch (err) {
      console.error("Employees Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  /* ============================== */
  /* 🔥 MERGE API + LIVE            */
  /* ============================== */

  const merged = employees.map((emp) => {
    const live = liveData?.employeeActivity?.find(
      (l) => l.userId === emp.id
    );

    return {
      ...emp,

      // 🔥 LIVE OVERRIDE
      status: live?.status || "Offline",
      productivity: live?.productivity ?? 0,
    };
  });

  /* ============================== */
  /* ➕ CREATE                      */
  /* ============================== */

  const handleCreate = async (payload: any) => {
    await createEmployee(payload);
    fetchEmployees();
  };

  /* ============================== */
  /* 🔁 TOGGLE ACCESS               */
  /* ============================== */

  const handleToggleAccess = async (id: string) => {
    await toggleAccess(id);

    // 🔥 OPTIMISTIC UPDATE (NO REFETCH)
    setEmployees((prev) =>
      prev.map((e) =>
        e.id === id
          ? {
              ...e,
              access_enabled: !e.access_enabled,
            }
          : e
      )
    );
  };

  /* ============================== */
  /* ❌ DELETE                      */
  /* ============================== */

  const handleDelete = async (id: string) => {
    await deleteEmployee(id);

    setEmployees((prev) =>
      prev.filter((e) => e.id !== id)
    );
  };

  return {
    data: merged,
    loading,
    handleCreate,
    handleToggleAccess,
    handleDelete,
  };
};

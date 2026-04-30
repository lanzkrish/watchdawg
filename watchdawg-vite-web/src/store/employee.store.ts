/** @format */

import { create } from "zustand";

import {
  createEmployee as createEmployeeAPI,
  deleteEmployee as deleteEmployeeAPI,
  getEmployees,
  toggleAccess as toggleAccessAPI,
} from "@/services/employee.service";

import type { Employee } from "@/types/employee.types";

/* ================================================= */
/* 🧠 STORE TYPE                                     */
/* ================================================= */

type EmployeeStore = {
  employees: Employee[];

  /* fetch */
  fetchEmployees: () => Promise<void>;

  /* actions */
  createEmployee: (data: {
    name: string;
    email: string;
    designation: string;
  }) => Promise<void>;

  toggleAccess: (id: string) => Promise<void>;
  deleteEmployee: (id: string) => Promise<void>;
};

/* ================================================= */
/* 🚀 STORE                                          */
/* ================================================= */

export const useEmployeeStore = create<EmployeeStore>((set) => ({
  employees: [],

  /* 📥 GET EMPLOYEES */
  fetchEmployees: async () => {
    const data = await getEmployees();
    set({ employees: data });
  },

  /* ➕ CREATE EMPLOYEE */
  createEmployee: async (payload) => {
    await createEmployeeAPI(payload);

    const data = await getEmployees();
    set({ employees: data });
  },

  /* 🔁 TOGGLE ACCESS */
  toggleAccess: async (id) => {
    await toggleAccessAPI(id);

    set((state) => ({
      employees: state.employees.map((emp) =>
        emp.id === id
          ? {
              ...emp,
              access_enabled: !emp.access_enabled,
            }
          : emp
      ),
    }));
  },

  /* ❌ DELETE EMPLOYEE */
  deleteEmployee: async (id) => {
    await deleteEmployeeAPI(id);

    set((state) => ({
      employees: state.employees.filter((emp) => emp.id !== id),
    }));
  },
}));

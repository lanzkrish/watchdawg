/** @format */

import type { Employee } from "@/types/employee.types";
import { api } from "./api";

/* ================================================= */
/* 📥 GET EMPLOYEES                                  */
/* ================================================= */

export const getEmployees = async (): Promise<Employee[]> => {
  const res = await api.get("/admin/employees");
  return res.data;
};

/* ================================================= */
/* ➕ CREATE EMPLOYEE                                */
/* ================================================= */

export interface CreateEmployeePayload {
  name: string;
  email: string;
  designation: string;
}

export const createEmployee = async (
  data: CreateEmployeePayload
) => {
  const res = await api.post("/admin/employees", data);
  return res.data;
};

/* ================================================= */
/* 🔁 TOGGLE ACCESS                                  */
/* ================================================= */

export const toggleAccess = async (id: string) => {
  const res = await api.patch(`/admin/employees/${id}/access`);
  return res.data;
};

/* ================================================= */
/* ❌ DELETE EMPLOYEE                                */
/* ================================================= */

export const deleteEmployee = async (id: string) => {
  const res = await api.delete(`/admin/employees/${id}`);
  return res.data;
};

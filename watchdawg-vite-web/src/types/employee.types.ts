/** @format */

export type Employee = {
  id: string; // UUID
  name: string;
  email: string;

  employee_id?: string; // EMP-001
  designation?: string;

  role: "employee" | "admin";
  is_active?: boolean;
  access_enabled?: boolean;

  status?: "online" | "offline"; // frontend only
  productivity?: number; // later use
};

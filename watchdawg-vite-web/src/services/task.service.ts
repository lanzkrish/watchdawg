/** @format */

import { api } from "./api";

import type {
  EmployeeTask,
  Task,
  TaskStatus,
} from "@/types/task.types";

/* ================================================= */
/* 🧠 PAYLOAD                                        */
/* ================================================= */

export interface CreateTaskPayload {
  title: string;
  description?: string;
  priority: "low" | "medium" | "high";
  deadline?: string;
  employeeIds: string[];
}

/* ================================================= */
/* ➕ CREATE TASK                                    */
/* ================================================= */

export const createTask = async (
  data: CreateTaskPayload
): Promise<{ message: string; taskId: string }> => {
  const res = await api.post("/tasks", data);
  return res.data;
};

/* ================================================= */
/* 📥 ADMIN: GET ALL TASKS                           */
/* ================================================= */

export const getAllTasks = async (): Promise<Task[]> => {
  const res = await api.get("/tasks");
  return res.data;
};

/* ================================================= */
/* 👤 EMPLOYEE: GET MY TASKS                         */
/* ================================================= */

export const getMyTasks = async (): Promise<EmployeeTask[]> => {
  const res = await api.get("/tasks/my");
  return res.data;
};

/* ================================================= */
/* 🔄 UPDATE TASK STATUS                             */
/* ================================================= */

export const updateTaskStatus = async (
  taskId: string,
  status: TaskStatus
): Promise<EmployeeTask> => {
  const res = await api.patch(`/tasks/${taskId}/status`, {
    status,
  });
  return res.data;
};

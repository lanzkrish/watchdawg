/** @format */

import { create } from "zustand";

import {
  createTask as createTaskAPI,
  getAllTasks,
  getMyTasks,
  updateTaskStatus,
} from "@/services/task.service";

import type { CreateTaskPayload } from "@/services/task.service";
import type {
  EmployeeTask,
  Task,
  TaskStatus,
} from "@/types/task.types";

/* ================================================= */
/* 🧠 STORE TYPE                                     */
/* ================================================= */

type TaskStore = {
  tasks: Task[] | EmployeeTask[];

  /* fetch */
  fetchTasks: () => Promise<void>;
  fetchMyTasks: () => Promise<void>;

  /* actions */
  createTask: (payload: CreateTaskPayload) => Promise<void>;
  updateStatus: (
    taskId: string,
    status: TaskStatus
  ) => Promise<void>;
};

/* ================================================= */
/* 🚀 STORE                                          */
/* ================================================= */

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],

  /* 👑 ADMIN: GET ALL TASKS */
  fetchTasks: async () => {
    const data = await getAllTasks();
    set({ tasks: data });
  },

  /* 👤 EMPLOYEE: GET MY TASKS */
  fetchMyTasks: async () => {
    const data = await getMyTasks();
    set({ tasks: data });
  },

  /* ➕ CREATE TASK */
  createTask: async (payload) => {
    await createTaskAPI(payload);

    const data = await getAllTasks();
    set({ tasks: data });
  },

  /* 🔄 UPDATE STATUS */
  updateStatus: async (taskId, status) => {
    await updateTaskStatus(taskId, status);

    set((state) => ({
      tasks: (state.tasks as EmployeeTask[]).map((t) =>
        t.id === taskId ? { ...t, my_status: status } : t
      ),
    }));
  },
}));

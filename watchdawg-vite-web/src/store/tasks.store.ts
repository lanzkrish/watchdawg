/** @format */

import type { Task } from "@/types/task.types";
import { create } from "zustand";

interface TaskState {
  tasks: Task[];

  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (task: Task) => void;
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],

  setTasks: (tasks) => set({ tasks }),

  addTask: (task) =>
    set((state) => ({
      tasks: [task, ...state.tasks],
    })),

  updateTask: (task) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === task.id ? task : t
      ),
    })),
}));

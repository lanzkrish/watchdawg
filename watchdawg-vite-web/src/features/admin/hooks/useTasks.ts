/** @format */

import { useTaskStore } from "@/store/task.store";
import { useEffect } from "react";

export const useTasks = (type: "admin" | "employee" = "admin") => {
  /* ✅ DO NOT CAST */
  const {
    tasks,
    fetchTasks,
    fetchMyTasks,
    createTask,
    updateStatus,
  } = useTaskStore();

  /* 🔄 Auto fetch */
  useEffect(() => {
    if (type === "admin") {
      fetchTasks();
    } else {
      fetchMyTasks();
    }
  }, [type, fetchTasks, fetchMyTasks]);

  return {
    tasks,
    createTask,
    updateStatus,
    refresh: type === "admin" ? fetchTasks : fetchMyTasks,
  };
};

/** @format */

import type { TaskPriority } from "@/types/task.types";
import GlassCard from "../ui/GlassCard";

type TaskPreview = {
  title: string;
  description?: string;
  priority: TaskPriority;
  deadline?: string;
  employeeIds?: string[];
};

type Props = {
  task: TaskPreview;
};

export default function TaskPreviewCard({ task }: Props) {
  if (!task?.title) return null;

  const hasDeadline = !!task.deadline;

  const isOverdue =
    hasDeadline &&
    new Date(task.deadline as string).getTime() < Date.now();

  /* 🔥 Format helpers */
  const formatPriority = (p: TaskPriority) =>
    p.charAt(0).toUpperCase() + p.slice(1);

  const formatDate = (d: string) =>
    new Date(d).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });

  return (
    <GlassCard>
      {/* TITLE */}
      <h3 className="text-white text-sm font-semibold">
        {task.title}
      </h3>

      {/* DESCRIPTION */}
      <p className="text-gray-400 text-xs mt-1">
        {task.description || "No description"}
      </p>

      <div className="mt-3 space-y-2 text-xs">

        {/* PRIORITY */}
        <div className="text-gray-400">
          Priority:{" "}
          <span
            className={`font-medium ${
              task.priority === "high"
                ? "text-red-400"
                : task.priority === "medium"
                ? "text-yellow-400"
                : "text-blue-400"
            }`}
          >
            {formatPriority(task.priority)}
          </span>
        </div>

        {/* DEADLINE */}
        {hasDeadline && (
          <div
            className={`px-2 py-1 rounded w-fit flex items-center gap-1
            ${
              isOverdue
                ? "bg-red-500/20 text-red-400"
                : "bg-gray-800 text-gray-300"
            }`}
          >
            ⏰ {formatDate(task.deadline as string)}
          </div>
        )}

        {/* ASSIGNEES COUNT */}
        {task.employeeIds && task.employeeIds.length > 0 && (
          <div className="text-gray-400">
            Assigned:{" "}
            <span className="text-gray-200">
              {task.employeeIds.length} employee
              {task.employeeIds.length > 1 ? "s" : ""}
            </span>
          </div>
        )}
      </div>
    </GlassCard>
  );
}

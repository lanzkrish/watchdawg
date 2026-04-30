/** @format */

import type {
  Task,
  TaskStatus,
} from "@/types/employeeDashboard.types";
import { useMemo } from "react";

/* ============================== */
/* 🎨 FAKE DATA (FIXED TYPES)     */
/* ============================== */

const tasks: Task[] = [
  {
    id: "1",
    userId: "u1",
    organizationId: "o1",
    title: "Build Dashboard UI",
    description: "Complete employee dashboard layout",
    status: "in-progress",
    priority: "high",
    progress: 65,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    deadline: Date.now() + 2 * 60 * 60 * 1000, // 2h
  },
  {
    id: "2",
    userId: "u1",
    organizationId: "o1",
    title: "Fix Socket Issues",
    description: "Resolve real-time update bugs",
    status: "pending",
    priority: "medium",
    progress: 20,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    deadline: Date.now() + 24 * 60 * 60 * 1000,
  },
  {
    id: "3",
    userId: "u1",
    organizationId: "o1",
    title: "Optimize Performance",
    description: "Improve render efficiency",
    status: "completed",
    priority: "low",
    progress: 100,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

/* ============================== */
/* 🎨 STYLE MAPS                  */
/* ============================== */

const statusStyle: Record<TaskStatus, string> = {
  pending: "text-yellow-400",
  "in-progress": "text-blue-400",
  completed: "text-green-400",
};

const priorityGlow = {
  high: "shadow-[0_0_20px_rgba(239,68,68,0.15)]",
  medium: "shadow-[0_0_20px_rgba(59,130,246,0.12)]",
  low: "",
};

/* ============================== */
/* 🧠 HELPERS                     */
/* ============================== */

function formatDeadline(ts?: number) {
  if (!ts) return "No deadline";

  const diff = ts - Date.now();

  if (diff <= 0) return "Overdue";

  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return "Due soon";

  if (hours < 24) return `${hours}h left`;

  const days = Math.floor(hours / 24);
  return `${days}d left`;
}

/* ============================== */
/* 🧩 COMPONENT                   */
/* ============================== */

export default function TaskSummary() {
  const stats = useMemo(() => {
    const completed = tasks.filter(
      (t) => t.status === "completed"
    ).length;

    return {
      total: tasks.length,
      completed,
      percent: Math.round((completed / tasks.length) * 100),
    };
  }, []);

  return (
    <div className="relative bg-gradient-to-br from-[#1e293b] to-[#0f172a] p-6 rounded-2xl border border-white/5 overflow-hidden">

      {/* glow */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.15),transparent_60%)] pointer-events-none" />

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-sm text-gray-400 uppercase tracking-wide">
          Tasks
        </h3>

        <div className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300">
          {stats.completed}/{stats.total} • {stats.percent}%
        </div>
      </div>

      {/* LIST */}
      <div className="space-y-4">

        {tasks.map((task) => {
          const deadlineText = formatDeadline(task.deadline);

          return (
            <div
              key={task.id}
              className={`
                group relative p-4 rounded-xl border
                border-white/5 bg-[#0f172a]/60
                hover:bg-[#1e293b]/70
                transition-all duration-300

                ${priorityGlow[task.priority]}
              `}
            >
              {/* TOP */}
              <div className="flex justify-between items-start">

                {/* LEFT */}
                <div className="min-w-0">

                  <p className="text-sm font-semibold text-white truncate">
                    {task.title}
                  </p>

                  <p className="text-xs text-gray-400 mt-1 truncate">
                    {task.description}
                  </p>

                  {/* META */}
                  <div className="flex items-center gap-2 mt-2 text-[10px]">

                    <span
                      className={`
                        capitalize
                        ${statusStyle[task.status]}
                      `}
                    >
                      {task.status}
                    </span>

                    <span className="text-gray-600">•</span>

                    <span className="text-gray-500 capitalize">
                      {task.priority}
                    </span>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="text-right">

                  <span className="text-xs text-gray-400">
                    {deadlineText}
                  </span>

                  {task.status === "completed" && (
                    <p className="text-[10px] text-green-400 mt-1">
                      ✔ Completed
                    </p>
                  )}
                </div>
              </div>

              {/* PROGRESS */}
              <div className="mt-4">

                <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                  <span>Progress</span>
                  <span>{task.progress}%</span>
                </div>

                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className={`
                      h-full rounded-full transition-all duration-500
                      ${
                        task.status === "completed"
                          ? "bg-green-500"
                          : "bg-blue-500"
                      }
                    `}
                    style={{ width: `${task.progress}%` }}
                  />
                </div>
              </div>

              {/* HOVER ACTION (future ready) */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition pointer-events-none rounded-xl border border-white/10" />
            </div>
          );
        })}

      </div>

      {/* FOOTER */}
      <div className="mt-6 flex justify-between items-center text-xs text-gray-500">
        <span>Stay consistent 🚀</span>

        <button className="text-blue-400 hover:text-blue-300 transition">
          View All →
        </button>
      </div>
    </div>
  );
}

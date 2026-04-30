/** @format */

export default function TaskCard({ task }: any) {
  return (
    <div className="p-4 rounded-xl bg-[#1e293b] border border-white/5">

      {/* TOP */}
      <div className="flex justify-between">

        <div>
          <p className="text-sm font-semibold text-white">
            {task.title}
          </p>

          <p className="text-xs text-gray-400 mt-1">
            {task.description}
          </p>
        </div>

        <span className="text-xs text-gray-400">
          {task.deadline}
        </span>
      </div>

      {/* STATUS */}
      <div className="flex items-center gap-2 mt-3 text-xs">

        <span
          className={`
            ${
              task.status === "in_progress"
                ? "text-blue-400"
                : task.status === "pending"
                ? "text-yellow-400"
                : "text-green-400"
            }
          `}
        >
          {task.status}
        </span>

        <span className="text-gray-500">
          • {task.priority}
        </span>
      </div>

      {/* PROGRESS */}
      <div className="mt-3">

        <div className="flex justify-between text-xs text-gray-400">
          <span>Progress</span>
          <span>{task.progress}%</span>
        </div>

        <div className="h-1.5 bg-white/10 rounded-full mt-1 overflow-hidden">

          <div
            className={`
              h-full rounded-full

              ${
                task.status === "completed"
                  ? "bg-green-400"
                  : "bg-blue-400"
              }
            `}
            style={{ width: `${task.progress}%` }}
          />

        </div>
      </div>

      {/* COMPLETED */}
      {task.status === "completed" && (
        <p className="text-xs text-green-400 mt-2">
          ✔ Completed
        </p>
      )}
    </div>
  );
}

/** @format */

import TaskCard from "./TaskCard";

export default function TaskSection({ title, status, tasks }: any) {
  const filtered = tasks.filter((t: any) => t.status === status);

  return (
    <div className="bg-[#0f172a] p-4 rounded-2xl border border-white/5">

      <div className="flex justify-between mb-4">
        <h3 className="text-xs text-gray-400 uppercase tracking-wide">
          {title}
        </h3>

        <span className="text-xs text-gray-500">
          {filtered.length}
        </span>
      </div>

      <div className="space-y-4">
        {filtered.map((task: any) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>

    </div>
  );
}

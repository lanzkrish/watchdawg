/** @format */

import { useState } from "react";

import GlassCard from "../ui/GlassCard";
import GradientButton from "../ui/GradientButton";
import Input from "../ui/Input";
import EmployeeSelector from "./EmployeeSelector";
import TaskPreviewCard from "./TaskPreviewCard";

import { useTasks } from "@/features/admin/hooks/useTasks";
import type { TaskPriority } from "@/types/task.types";

type TaskForm = {
  title: string;
  description?: string;
  priority: TaskPriority;
  deadline?: string;
  employeeIds: string[];
};

export default function CreateTaskPanel() {
  const { createTask } = useTasks("admin");

  const [form, setForm] = useState<TaskForm>({
    title: "",
    description: "",
    priority: "medium",
    deadline: "",
    employeeIds: [],
  });

  const handleSubmit = async () => {
    if (!form.title || form.employeeIds.length === 0) return;

    await createTask(form);

    // reset
    setForm({
      title: "",
      description: "",
      priority: "medium",
      deadline: "",
      employeeIds: [],
    });
  };

  return (
    <div className="space-y-4">

      {/* FORM */}
      <GlassCard>
        <h2 className="text-white text-lg font-medium mb-4">
          Create Task
        </h2>

        <div className="space-y-4">

          {/* TITLE */}
          <Input
            placeholder="Task title"
            value={form.title}
            onChange={(e: any) =>
              setForm({ ...form, title: e.target.value })
            }
          />

          {/* DESCRIPTION */}
          <textarea
            value={form.description}
            placeholder="Short description"
            onChange={(e: any) =>
              setForm({ ...form, description: e.target.value })
            }
            className="w-full bg-gray-900 border border-white/10 rounded-md px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
          />

          {/* ROW: PRIORITY + DEADLINE */}
          <div className="grid grid-cols-2 gap-3">

            {/* PRIORITY */}
            <select
              value={form.priority}
              onChange={(e) =>
                setForm({
                  ...form,
                  priority: e.target.value as TaskPriority,
                })
              }
              className="bg-gray-900 text-white border border-white/10 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>

            {/* DEADLINE */}
            <input
              type="datetime-local"
              value={form.deadline}
              onChange={(e) =>
                setForm({ ...form, deadline: e.target.value })
              }
              className="bg-gray-900 text-white border border-white/10 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500"
            />
          </div>

          {/* ASSIGNEES */}
          <EmployeeSelector
            onChange={(ids: string[]) =>
              setForm({ ...form, employeeIds: ids })
            }
          />

          {/* BUTTON */}
          <GradientButton onClick={handleSubmit}>
            Create Task
          </GradientButton>

        </div>
      </GlassCard>

      {/* PREVIEW */}
      <TaskPreviewCard task={form} />

    </div>
  );
}

/** @format */

import { mockTasks } from "@/features/employee/components/tasks/mockTasks";
import TaskHeader from "@/features/employee/components/tasks/TaskHeader";
import TaskSection from "@/features/employee/components/tasks/TaskSection";
// import { useTaskStore } from "@/store/tasks.store";

export default function TasksPage() {
  // const tasks = useTaskStore((s) => s.tasks);

  return (
    <div className="space-y-6">

      <TaskHeader />

      <div className="grid md:grid-cols-3 gap-6">

        <TaskSection
          title="Pending"
          status="pending"
          tasks={mockTasks}
        />

        <TaskSection
          title="In Progress"
          status="in_progress"
          tasks={mockTasks}
        />

        <TaskSection
          title="Completed"
          status="completed"
          tasks={mockTasks}
        />

      </div>
    </div>
  );
}

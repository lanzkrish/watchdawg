/** @format */

import type { Employee } from "@/types/employee.types";
import StatusBadge from "../ui/StatusBadge";

type Props = {
  user: Employee;
};

export default function EmployeeRow({ user }: Props) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-white/5 text-sm">

      {/* Name + Email */}
      <div className="flex flex-col">
        <span className="text-white font-medium">
          {user.name}
        </span>
        <span className="text-gray-400 text-xs">
          {user.email}
        </span>
      </div>

      {/* Designation */}
      <span className="text-gray-300">
        {user.designation}
      </span>

      {/* Employee ID */}
      <span className="text-gray-500 text-xs">
        {user.employee_id}
      </span>

      {/* Status */}
      <StatusBadge
        status={user.access_enabled ? "active" : "inactive"}
      />
    </div>
  );
}

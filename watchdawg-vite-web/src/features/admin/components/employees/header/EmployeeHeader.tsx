/** @format */

import Input from "../ui/Input";

export default function EmployeesHeader() {
  return (
    <div className="flex items-center justify-between">

      {/* Left */}
      <div>
        <h1 className="text-2xl font-semibold text-white tracking-tight">
          Employees
        </h1>
        <p className="text-sm text-gray-400">
          Manage your team and assign tasks
        </p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        <div className="w-64">
          <Input placeholder="Search..." />
        </div>

        <span className="flex items-center gap-1 text-xs font-medium text-green-400">
          <span className="w-2 h-2 rounded-full bg-green-400" />
          Live
        </span>
      </div>

    </div>
  );
}

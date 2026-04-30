/** @format */

import { EmployeeReportCard } from "./EmployeeReportCard";

type Employee = {
  id: string;
  name: string;
};

export function EmployeeReportSection({
  employees,
}: {
  employees: Employee[];
}) {
  return (
    <div className="space-y-5">

      <h2 className="text-lg font-medium text-white">
        Individual Employee Reports
      </h2>

      <div className="space-y-4">

        {employees.map((emp) => (
          <div
            key={emp.id}
            className="bg-gray-900 border border-white/10 rounded-xl p-4"
          >
            {/* EMPLOYEE NAME */}
            <p className="text-white font-medium mb-3">
              {emp.name}
            </p>

            {/* REPORT TYPES */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

              {["Daily", "Weekly", "Monthly", "Yearly"].map(
                (type) => (
                  <EmployeeReportCard
                    key={type}
                    title={type}
                    employeeId={emp.id}
                  />
                )
              )}

            </div>
          </div>
        ))}

      </div>
    </div>
  );
}

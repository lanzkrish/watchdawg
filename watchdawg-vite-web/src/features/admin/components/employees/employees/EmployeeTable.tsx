/** @format */

import GlassCard from "../ui/GlassCard";
import EmployeeRow from "./EmployeeRow";
import EmptyEmployees from "./EmptyEmployees";

import type { Employee } from "@/types/employee.types";

type Props = {
  employees: Employee[];
};

export default function EmployeeTable({ employees }: Props) {
  return (
    <GlassCard>
      <h2 className="text-white text-lg font-medium mb-4">
        Employees
      </h2>

      {employees.length === 0 ? (
        <EmptyEmployees />
      ) : (
        <div>
          {employees.map((emp) => (
            <EmployeeRow key={emp.id} user={emp} />
          ))}
        </div>
      )}
    </GlassCard>
  );
}

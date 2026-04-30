/** @format */

import EmployeesHeader from "@/features/admin/components/employees/header/EmployeeHeader";
import EmployeesLayout from "@/features/admin/components/employees/layout/EmployeesLayout";

import EmployeeTable from "@/features/admin/components/employees/employees/EmployeeTable";
import AddEmployeeForm from "@/features/admin/components/employees/forms/AddEmployeeForm";
import CreateTaskPanel from "@/features/admin/components/employees/forms/CreateTaskPanel";

import { useEmployees } from "@/features/admin/hooks/useEmployees";

export default function WorkforcePage() {
  const { employees } = useEmployees();

  return (
    <div className="min-h-screen bg-[#0b0f17] px-6 py-5 space-y-6">

      {/* HEADER */}
      <EmployeesHeader />

      {/* MAIN LAYOUT */}
      <EmployeesLayout
        left={
          <>
            {/* EMPLOYEE TABLE */}
            <EmployeeTable employees={employees} />

            {/* ADD EMPLOYEE FORM */}
            <AddEmployeeForm />
          </>
        }
        right={
          <>
            {/* CREATE TASK PANEL */}
            <CreateTaskPanel />
          </>
        }
      />

    </div>
  );
}

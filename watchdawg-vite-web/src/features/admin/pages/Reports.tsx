/** @format */

import { useEmployees } from "@/features/admin/hooks/useEmployees";
import { useReports } from "@/features/admin/hooks/useReports";
import { EmployeeReportSection } from "../components/reports/EmployeeReportSection";
import { ReportSection } from "../components/reports/ReportSection";

export default function Reports() {
  const { loading } = useReports();
  const { employees } = useEmployees();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-gray-400">
        Loading reports...
      </div>
    );
  }

  return (
    <div className="space-y-10">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-semibold text-white">
          Reports
        </h1>
        <p className="text-gray-400 text-sm">
          Download and manage reports
        </p>
      </div>

      {/* EXISTING SECTIONS */}
      <ReportSection
        title="Employee Reports"
        items={[
          { title: "Daily Report" },
          { title: "Weekly Report" },
          { title: "Monthly Report" },
          { title: "Yearly Report" },
        ]}
      />

      {/* 🔥 NEW SECTION */}
      <EmployeeReportSection employees={employees} />

    </div>
  );
}

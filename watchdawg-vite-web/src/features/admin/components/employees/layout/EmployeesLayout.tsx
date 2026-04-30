/** @format */

import type { ReactNode } from "react";

type Props = {
  left: ReactNode;
  right: ReactNode;
};

export default function EmployeesLayout({ left, right }: Props) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

      {/* Main Content */}
      <div className="lg:col-span-2 space-y-6">
        {left}
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {right}
      </div>

    </div>
  );
}

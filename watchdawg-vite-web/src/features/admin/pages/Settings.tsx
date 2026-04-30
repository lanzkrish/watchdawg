/** @format */

import { Data } from "@/features/admin/components/settings/Data";
import { EmployeeControl } from "@/features/admin/components/settings/EmployeeControl";
import { Notifications } from "@/features/admin/components/settings/Notification";
import { Organization } from "@/features/admin/components/settings/Organization";
import { Security } from "@/features/admin/components/settings/Security";
import { Tracking } from "@/features/admin/components/settings/Tracking";
import { useState } from "react";

const tabs = [
  "Organization",
  "Employee Control",
  "Tracking",
  "Security",
  "Notifications",
  "Data",
];

export default function Settings() {
  const [active, setActive] = useState("Organization");

  return (
    <div className='flex gap-6'>
      {/* 🔥 SIDEBAR */}
      <div className='w-64 bg-gray-900/60 border border-gray-700 rounded-2xl p-4 space-y-2'>
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`w-full text-left px-4 py-2 rounded-xl transition ${
              active === tab
                ? "bg-purple-500 text-white"
                : "text-gray-400 hover:bg-gray-800"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 🔥 CONTENT */}
      <div className='flex-1 bg-gray-900/60 border border-gray-700 rounded-2xl p-6'>
        {active === "Organization" && <Organization />}
        {active === "Employee Control" && <EmployeeControl />}
        {active === "Tracking" && <Tracking />}
        {active === "Security" && <Security />}
        {active === "Notifications" && <Notifications />}
        {active === "Data" && <Data />}
      </div>
    </div>
  );
}

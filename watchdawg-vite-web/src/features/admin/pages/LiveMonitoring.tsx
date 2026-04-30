/** @format */

import { useMemo } from "react";

import ActivityFolder from "@/features/admin/components/liveMonitoring/ActivityFolder";
import EmptyState from "@/features/admin/components/liveMonitoring/EmptyState";
import { useAdminStore } from "@/store/admin.store";
import { useGroupedEmployees } from "../hooks/useGroupedEmployees";

export default function LiveMonitoringPage() {

  /* ✅ STEP 1: GET RAW MAP (STABLE) */
  const liveMap = useAdminStore((s) => s.liveActivities);

  /* ✅ STEP 2: CONVERT TO ARRAY (MEMOIZED) */
  const employees = useMemo(() => {
    return Object.values(liveMap);
  }, [liveMap]);

  /* ✅ STEP 3: GROUPING */
  const grouped = useGroupedEmployees(employees);

  const isEmpty = employees.length === 0;

  return (
    <div className="space-y-4">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold text-white">
          Live Monitoring
        </h1>

        <span className="text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded">
          ● Live
        </span>
      </div>

      {/* EMPTY */}
      {isEmpty && <EmptyState />}

      {/* GROUPS */}
      {!isEmpty &&
        Object.entries(grouped).map(([group, users]) => (
          <ActivityFolder
            key={group}
            name={group}
            users={users}
          />
        ))}
    </div>
  );
}

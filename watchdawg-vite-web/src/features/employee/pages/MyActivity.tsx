import { useActivity } from "@/features/employee/hooks/useEmployeeActivity";
// import { useEmployeeDashboardStore } from "../../../store/analytics.store";

import ActivityHeader from "@/features/employee/components/activity/ActivityHeader";
import ActivitySkeleton from "@/features/employee/components/activity/ActivitySkeleton";
import { useEffect } from "react";

export default function ActivityPage() {
  const { data, loading } = useActivity();

  // 🔥 LIVE FROM SOCKET STORE
  // const live = useEmployeeDashboardStore((s) => s.live);

  useEffect(() => {
  console.log("📦 API DATA (history):", data);
}, [data]);

// useEffect(() => {
//   console.log("🔥 LIVE DATA (socket):", live);
// }, [live]);


  if (loading) return <ActivitySkeleton />;

  return (
    <div className="space-y-6">
      <ActivityHeader />

      {/* <ActivityList
        live={live}
        history={data}
      /> */}
    </div>
  );
}

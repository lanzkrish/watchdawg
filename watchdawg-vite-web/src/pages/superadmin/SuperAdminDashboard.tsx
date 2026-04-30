// /** @format */

// import { Icons } from "@/components/icons";
// import RecentActivity from "@/features/superadmin/components/dashboard/RecentActivity";
// import RevenueChart from "@/features/superadmin/components/dashboard/RevenueChart";
// import StatCard from "@/features/superadmin/components/dashboard/StatCard";
// import SystemHealth from "@/features/superadmin/components/dashboard/SystemHealth";
// import { useDashboard } from "@/hooks/useDashboard";

// export default function SuperAdminDashboard() {
//   const token = localStorage.getItem("token") || "";

//   const { data, loading } = useDashboard(token);

//   if (loading || !data) return <div>Loading...</div>;

//   return (
//     <div className='space-y-6'>
//       <h1 className='text-3xl font-bold'>Platform Overview</h1>

//       {/* 🔥 STATS */}
//       <div className='grid md:grid-cols-4 gap-5'>
//         <StatCard
//           title='Total Companies'
//           value={data.stats.totalCompanies}
//           icon={<Icons.Briefcase />}
//         />

//         <StatCard
//           title='Total Users'
//           value={data.stats.totalUsers}
//           icon={<Icons.Users />}
//         />

//         <StatCard
//           title='Monthly Revenue'
//           value={`₹${data.stats.monthlyRevenue}`}
//           icon={<Icons.BarChart3 />}
//         />

//         <StatCard
//           title='System Uptime'
//           value={`${Math.floor(data.stats.systemUptime)}s`}
//           icon={<Icons.Activity />}
//         />
//       </div>

//       {/* 📈 REVENUE */}
//       <RevenueChart data={data.revenueGraph} />

//       {/* 🩺 SYSTEM HEALTH */}
//       <SystemHealth data={data.systemHealth} />

//       {/* 📜 ACTIVITY */}
//       <RecentActivity data={data.recentActivity} />
//     </div>
//   );
// }

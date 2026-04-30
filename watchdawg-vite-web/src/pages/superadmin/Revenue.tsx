// /** @format */

// import { ChartCard } from "@/features/superadmin/components/revenue/ChartCard";
// import { CompanyTable } from "@/features/superadmin/components/revenue/CompanyTable";
// import { StatCard } from "@/features/superadmin/components/revenue/StatCard";
// import { TopCompanies } from "@/features/superadmin/components/revenue/TopCompany";
// import { useRevenue } from "@/hooks/useRevenue";
// import { useAuthStore } from "@/store/auth.store";

// export default function Revenue() {
//   const token = useAuthStore((s) => s.token);
//   const { data, loading } = useRevenue(token || "");

//   if (loading || !data) return <div>Loading...</div>;

//   const productivityData = data.productivityTrend.map((d) => ({
//   name: new Date(d.date).toLocaleDateString(),
//   value: d.productivity,
// }));

// const safeProductivityData =
//   productivityData.length > 1
//     ? productivityData
//     : [
//         { name: productivityData[0]?.name || "Today", value: productivityData[0]?.value || 0 },
//         { name: "Next", value: productivityData[0]?.value || 0 },
//       ];

//   return (
//     <div className='space-y-6'>
//       <h1 className='text-3xl font-bold'>Revenue Dashboard</h1>

//       {/* 🔥 STATS */}
//       <div className='grid md:grid-cols-4 gap-5'>
//         <StatCard title='Total Revenue' value={`₹${data.stats.totalRevenue}`} />
//         <StatCard title='Monthly Revenue' value={`₹${data.stats.monthlyRevenue}`} />
//         <StatCard title='ARPU' value={`₹${data.stats.arpu}`} />
//         <StatCard title='Growth' value={`${data.stats.growth}%`} />
//       </div>

//       {/* 📈 REVENUE TREND */}
//       <ChartCard
//         title='Revenue Trend'
//         data={data.revenueChart.map((d) => ({
//           name: new Date(d.date).toLocaleDateString(),
//           value: d.revenue,
//         }))}
//       />

//       {/* 🏢 REVENUE BY COMPANY */}
//       <CompanyTable data={data.revenueByCompany} />

//       {/* 🏆 TOP COMPANIES */}
//       <TopCompanies data={data.topCompanies} />
//     </div>
//   );
// }

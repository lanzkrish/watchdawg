// /** @format */

// import LineChart from "@/components/charts/LineChart";
// import type { RevenuePoint } from "@/types/dashboard.types";

// interface Props {
//   data: RevenuePoint[];
// }

// export default function RevenueChart({ data }: Props) {
//   const chartData = data.map((d) => ({
//     name: d.month, // ✅ fixed
//     value: d.revenue,
//   }));
// //
//   return (
//     <div className='bg-gray-900/60 border border-gray-700 p-6 rounded-2xl'>
//       <h3 className='mb-4 font-semibold'>Revenue Overview</h3>
//       <LineChart data={chartData} />
//     </div>
//   );
// }

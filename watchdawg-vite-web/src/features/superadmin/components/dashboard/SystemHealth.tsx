// /** @format */

// import { Icons } from "@/components/icons";
// import type { SystemHealth as Health } from "@/types/dashboard.types";

// interface Props {
//   data: Health;
// }

// export default function SystemHealth({ data }: Props) {
//   return (
//     <div className='space-y-4'>
//       <h3 className='font-semibold text-lg'>System Health</h3>

//       <div className='grid md:grid-cols-3 gap-5'>
//         {/* 🔥 API SERVER */}
//         <HealthCard
//           title='API Server'
//           value={data.apiServer}
//           status={data.apiServer === "online"}
//           icon={<Icons.Activity />}
//         />

//         {/* 🔥 DATABASE */}
//         <HealthCard
//           title='Database'
//           value={data.database}
//           status={data.database === "healthy"}
//           icon={<Icons.Database />}
//         />

//         {/* 🔥 STORAGE */}
//         <HealthCard
//           title='Storage'
//           value={data.storageUsed}
//           status={true}
//           icon={<Icons.HardDrive />}
//         />
//       </div>
//     </div>
//   );
// }

// /* 🔥 REUSABLE CARD */
// function HealthCard({
//   title,
//   value,
//   status,
//   icon,
// }: {
//   title: string;
//   value: string;
//   status: boolean;
//   icon: React.ReactNode;
// }) {
//   return (
//     <div className='bg-gray-900/60 backdrop-blur-xl border border-gray-700 p-5 rounded-2xl flex items-center justify-between'>
//       <div>
//         <p className='text-gray-400 text-sm'>{title}</p>

//         <h2
//           className={`text-lg font-semibold ${
//             status ? "text-green-400" : "text-red-400"
//           }`}
//         >
//           {value}
//         </h2>
//       </div>

//       <div className='text-gray-400'>{icon}</div>
//     </div>
//   );
// }

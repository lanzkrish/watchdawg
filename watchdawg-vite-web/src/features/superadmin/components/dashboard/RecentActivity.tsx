// /** @format */

// import { Icons } from "@/components/icons";
// import type { ActivityItem } from "@/types/dashboard.types";

// interface Props {
//   data: ActivityItem[];
// }

// export default function RecentActivity({ data }: Props) {
//   return (
//     <div className='bg-gray-900/60 backdrop-blur-xl border border-gray-700 p-6 rounded-2xl'>
//       <h3 className='mb-6 font-semibold text-lg'>Recent Activity</h3>

//       <div className='space-y-5'>
//         {data.map((item, i) => (
//           <div
//             key={i}
//             className='flex items-start gap-4 group transition'
//           >
//             {/* 🔵 ICON + TIMELINE */}
//             <div className='flex flex-col items-center'>
//               <div className='p-2 bg-gray-800 rounded-full text-gray-300 group-hover:bg-purple-500/20 group-hover:text-purple-400 transition'>
//                 {getIcon(item.type)}
//               </div>

//               {/* 🔥 LINE */}
//               {i !== data.length - 1 && (
//                 <div className='w-px h-full bg-gray-700 mt-2' />
//               )}
//             </div>

//             {/* 📄 CONTENT */}
//             <div className='flex-1'>
//               <p className='text-sm text-gray-200 group-hover:text-white transition'>
//                 {item.message}
//               </p>

//               <p className='text-xs text-gray-500 mt-1'>
//                 {new Date(item.time).toLocaleString()}
//               </p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// /* 🔥 ICON MAPPER */
// function getIcon(type: string) {
//   switch (type) {
//     case "company":
//       return <Icons.Briefcase size={16} />;
//     case "server":
//       return <Icons.Server size={16} />;
//     case "revenue":
//       return <Icons.BarChart3 size={16} />;
//     default:
//       return <Icons.Activity size={16} />;
//   }
// }

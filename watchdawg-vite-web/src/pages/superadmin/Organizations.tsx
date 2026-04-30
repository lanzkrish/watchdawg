// /** @format */

// import { useOrganizations } from "@/hooks/useOrganization";
// import { useAuthStore } from "@/store/auth.store";

// export default function Organizations() {
//   const token = useAuthStore((s) => s.token);
//   const { data, loading } = useOrganizations(token || "");

//   if (loading) return <div>Loading...</div>;

//   return (
//     <div className='space-y-6'>
//       <h1 className='text-3xl font-bold'>Companies & Users</h1>

//       <div className='bg-gray-900/60 border border-gray-700 rounded-2xl overflow-hidden'>
//         <table className='w-full text-sm'>
//           <thead className='bg-gray-800 text-gray-400'>
//             <tr>
//               <th className='p-4 text-left'>Company</th>
//               <th className='p-4 text-left'>Admin</th>
//               <th className='p-4 text-left'>Users</th>
//               <th className='p-4 text-left'>Status</th>
//             </tr>
//           </thead>

//           <tbody>
//             {data.map((org) => (
//               <tr
//                 key={org.id}
//                 className='border-t border-gray-700 hover:bg-gray-800/40 transition'
//               >
//                 <td className='p-4'>{org.company}</td>
//                 <td className='p-4'>{org.adminName}</td>
//                 <td className='p-4'>{org.totalUsers}</td>
//                 <td className='p-4'>
//                   <span className='text-green-400'>● Active</span>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

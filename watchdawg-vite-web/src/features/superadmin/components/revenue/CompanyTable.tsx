// /** @format */

// export function CompanyTable({ data }: any) {
//   return (
//     <div className='bg-gray-900/60 p-6 rounded-2xl border border-gray-700'>
//       <h3 className='mb-4 font-semibold'>Revenue by Company</h3>

//       <table className='w-full text-sm'>
//         <thead className='text-gray-400'>
//           <tr>
//             <th className='p-3 text-left'>Company</th>
//             <th className='p-3 text-left'>Users</th>
//             <th className='p-3 text-left'>Revenue</th>
//           </tr>
//         </thead>

//         <tbody>
//           {data.map((c: any, i: number) => (
//             <tr key={i} className='border-t border-gray-700'>
//               <td className='p-3'>{c.company}</td>
//               <td className='p-3'>{c.users}</td>
//               <td className='p-3'>₹{c.revenue}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

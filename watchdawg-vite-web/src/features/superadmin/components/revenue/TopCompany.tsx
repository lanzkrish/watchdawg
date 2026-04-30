// /** @format */

// export function TopCompanies({ data }: any) {
//   return (
//     <div className='bg-gray-900/60 p-6 rounded-2xl border border-gray-700'>
//       <h3 className='mb-4 font-semibold'>Top Companies</h3>

//       <div className='space-y-3'>
//         {data.map((c: any, i: number) => (
//           <div
//             key={i}
//             className='flex justify-between border-b border-gray-700 pb-2'
//           >
//             <span>{c.company}</span>

//             <div className='text-right'>
//               <p>₹{c.revenue}</p>
//               <p className='text-xs text-gray-400'>
//                 Productivity: {c.productivity.toFixed(1)}
//               </p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

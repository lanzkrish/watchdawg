// /** @format */

// import LineChart from "../../components/charts/LineChart";

// const data = [
//   { name: "Mon", value: 60 },
//   { name: "Tue", value: 80 },
//   { name: "Wed", value: 75 },
//   { name: "Thu", value: 90 },
//   { name: "Fri", value: 85 },
// ];

// export default function Analytics() {
//   return (
//     <div className='space-y-6'>
//       <h1 className='text-3xl font-bold'>Analytics</h1>

//       {/* Charts */}
//       <div className='grid md:grid-cols-2 gap-5'>
//         <LineChart data={data} />
//         <LineChart data={data} />
//       </div>

//       {/* Insights */}
//       <div className='bg-gray-900 p-6 rounded-2xl'>
//         <h3 className='font-semibold mb-2'>Insights</h3>
//         <p className='text-gray-400 text-sm'>Most employees show peak productivity on Thursday. Idle time spikes mid-week indicating possible workload imbalance.</p>
//       </div>
//     </div>
//   );
// }

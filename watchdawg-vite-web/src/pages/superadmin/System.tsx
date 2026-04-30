// /** @format */

// import { useSystem } from "@/hooks/useSystem";
// import { useAuthStore } from "@/store/auth.store";

// export default function System() {
//   const token = useAuthStore((s) => s.token);
//   const data = useSystem(token || "");

//   if (!data) return <div>Loading...</div>;

//   return (
//     <div className='space-y-6'>
//       <h1 className='text-3xl font-bold'>Tickets & Logs</h1>

//       {/* 🎫 TICKETS */}
//       <Section title='Support Tickets'>
//         {data.tickets.map((t: any) => (
//           <Row key={t.id} title={t.title} status={t.status} />
//         ))}
//       </Section>

//       {/* ⚠️ ISSUES */}
//       <Section title='System Issues'>
//         {data.issues.map((i: any) => (
//           <Row key={i.id} title={i.message} status={i.status} />
//         ))}
//       </Section>

//       {/* 📜 LOGS */}
//       <Section title='System Logs'>
//         {data.logs.map((l: any) => (
//           <LogRow key={l.id} log={l} />
//         ))}
//       </Section>
//     </div>
//   );
// }

// /* ================= COMPONENTS ================= */

// function Section({ title, children }: any) {
//   return (
//     <div className='bg-gray-900/60 p-6 rounded-2xl border border-gray-700'>
//       <h3 className='mb-4 font-semibold'>{title}</h3>
//       <div className='space-y-3'>{children}</div>
//     </div>
//   );
// }

// function Row({ title, status }: any) {
//   return (
//     <div className='flex justify-between'>
//       <span>{title}</span>
//       <span className={status === "open" ? "text-red-400" : "text-green-400"}>
//         {status}
//       </span>
//     </div>
//   );
// }

// function LogRow({ log }: any) {
//   return (
//     <div className='flex justify-between text-sm'>
//       <span>{log.message}</span>
//       <span className='text-gray-400'>
//         {new Date(log.time).toLocaleString()}
//       </span>
//     </div>
//   );
// }

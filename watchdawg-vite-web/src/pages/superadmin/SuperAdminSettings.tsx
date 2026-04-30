// /** @format */

// import { useSettings } from "@/hooks/useSettings";
// import { useAuthStore } from "@/store/auth.store";
// import { useEffect, useState } from "react";

// /* ================= TYPES ================= */

// type SettingsForm = {
//   platformName: string;
//   systemEmail: string;
//   pricePerUser: number;
//   maxUsers: number;
//   maintenanceMode: boolean;
// };

// type InputProps = {
//   label: string;
//   value: string | number;
//   onChange: (value: string) => void;
//   type?: string;
// };

// /* ================= PAGE ================= */

// export default function Settings() {
//   const token = useAuthStore((s) => s.token);
//   const { data, loading, save } = useSettings(token || "");

//   const [form, setForm] = useState<SettingsForm>({
//     platformName: "",
//     systemEmail: "",
//     pricePerUser: 0,
//     maxUsers: 0,
//     maintenanceMode: false,
//   });

//   useEffect(() => {
//     if (data) {
//       setForm({
//         platformName: data.platformName || "",
//         systemEmail: data.systemEmail || "",
//         pricePerUser: Number(data.pricePerUser || 0),
//         maxUsers: Number(data.maxUsers || 0),
//         maintenanceMode: Boolean(data.maintenanceMode),
//       });
//     }
//   }, [data]);

//   if (loading) return <div>Loading...</div>;

//   const handleChange = (
//     key: keyof SettingsForm,
//     value: string | number | boolean
//   ) => {
//     setForm((prev) => ({ ...prev, [key]: value }));
//   };

//   const handleSave = () => {
//     save(form);
//   };

//   return (
//     <div className='space-y-6'>
//       <h1 className='text-3xl font-bold'>Settings</h1>

//       <div className='bg-gray-900/60 p-6 rounded-2xl border border-gray-700 space-y-5'>

//         {/* PLATFORM NAME */}
//         <Input
//           label='Platform Name'
//           value={form.platformName}
//           onChange={(v) => handleChange("platformName", v)}
//         />

//         {/* EMAIL */}
//         <Input
//           label='System Email'
//           value={form.systemEmail}
//           onChange={(v) => handleChange("systemEmail", v)}
//         />

//         {/* PRICE */}
//         <Input
//           label='Price per User (₹)'
//           type='number'
//           value={form.pricePerUser}
//           onChange={(v) => handleChange("pricePerUser", Number(v))}
//         />

//         {/* MAX USERS */}
//         <Input
//           label='Max Users'
//           type='number'
//           value={form.maxUsers}
//           onChange={(v) => handleChange("maxUsers", Number(v))}
//         />

//         {/* MAINTENANCE MODE */}
//         <div className='flex justify-between items-center'>
//           <span>Maintenance Mode</span>
//           <input
//             type='checkbox'
//             checked={form.maintenanceMode}
//             onChange={(e) =>
//               handleChange("maintenanceMode", e.target.checked)
//             }
//           />
//         </div>

//         {/* SAVE BUTTON */}
//         <button
//           onClick={handleSave}
//           className='w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl hover:opacity-90 transition'
//         >
//           Save Settings
//         </button>
//       </div>
//     </div>
//   );
// }

// /* ================= INPUT COMPONENT ================= */

// function Input({ label, value, onChange, type = "text" }: InputProps) {
//   return (
//     <div>
//       <label className='text-sm text-gray-400'>{label}</label>
//       <input
//         type={type}
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         className='w-full mt-1 p-3 bg-gray-800 rounded-xl outline-none focus:ring-2 focus:ring-purple-500'
//       />
//     </div>
//   );
// }

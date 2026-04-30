// /** @format */

// import { useAuth } from "@/hooks/useAuth";
// import { motion } from "framer-motion";
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// export default function SuperAdminLogin() {
//   const navigate = useNavigate();
//   const { login } = useAuth();

//   const [form, setForm] = useState({
//     email: "",
//     password: "",
//   });

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleChange = (key: string, value: string) => {
//     setForm((prev) => ({ ...prev, [key]: value }));
//   };

//   const handleLogin = async () => {
//     if (!form.email || !form.password) {
//       setError("Please fill all fields");
//       return;
//     }

//     try {
//       setLoading(true);
//       setError("");

//       const res = await login(form.email, form.password);

//       // 🔥 Ensure only superadmin can enter
//       if (res.user.role !== "superadmin") {
//         setError("Access denied: Not a super admin");
//         return;
//       }

//       // ✅ Navigate after success
//      navigate("/greeting", {
//   state: {
//     type: "login",
//     role: "superadmin",
//     name: res.user.name,
//   },
// });
//     } catch (err: any) {
//       setError("Invalid credentials");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className='min-h-screen flex items-center justify-center bg-black text-white'>
//       <motion.div
//         initial={{ opacity: 0, scale: 0.95 }}
//         animate={{ opacity: 1, scale: 1 }}
//         className='bg-gray-900/60 backdrop-blur-xl border border-gray-700 p-8 rounded-3xl w-full max-w-md space-y-6'
//       >
//         <h1 className='text-2xl font-bold text-center'>
//           Super Admin Login
//         </h1>

//         {/* 🔴 ERROR */}
//         {error && (
//           <div className='text-red-400 text-sm text-center'>
//             {error}
//           </div>
//         )}

//         {/* 🔑 INPUTS */}
//         <div className='space-y-4'>
//           <input
//             placeholder='Secure Email'
//             value={form.email}
//             onChange={(e) => handleChange("email", e.target.value)}
//             className='w-full p-3 bg-gray-800 rounded-xl outline-none'
//           />

//           <input
//             type='password'
//             placeholder='Password'
//             value={form.password}
//             onChange={(e) => handleChange("password", e.target.value)}
//             className='w-full p-3 bg-gray-800 rounded-xl outline-none'
//           />
//         </div>

//         {/* 🚀 BUTTON */}
//         <button
//           onClick={handleLogin}
//           disabled={loading}
//           className='w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl disabled:opacity-50'
//         >
//           {loading ? "Entering..." : "Enter Platform"}
//         </button>
//       </motion.div>
//     </div>
//   );
// }

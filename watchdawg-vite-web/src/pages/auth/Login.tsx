/** @format */

import { Icons } from "@/components/icons";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

/* 🔥 Role type */
type Role = "admin" | "employee";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState<{
    email: string;
    password: string;
    role: Role;
  }>({
    email: "",
    password: "",
    role: "admin",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (key: keyof typeof formData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: key === "role" ? (value as Role) : value,
    }));
  };

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      setError("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await login(formData.email, formData.password);

      console.log("LOGIN RESPONSE:", res);

      /* 🔥 USE BACKEND ROLE */
      const role = res.user.role;

      navigate("/greeting", {
        state: {
          type: "login",
          role,
          name: res.user.name,
        },
      });
    } catch (err: any) {
      console.error(err);
      setError("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white px-4'>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className='bg-gray-900/60 backdrop-blur-xl border border-gray-700/50 p-8 rounded-3xl w-full max-w-md shadow-2xl space-y-6'
      >
        {/* HEADER */}
        <div className='text-center space-y-2'>
          <h1 className='text-2xl font-bold'>Welcome Back</h1>
          <p className='text-gray-400 text-sm'>
            Login to your workspace
          </p>
        </div>

        {/* 🔴 ERROR */}
        {error && (
          <div className='text-red-400 text-sm text-center'>
            {error}
          </div>
        )}

        {/* ROLE SWITCH (UI ONLY, NOT TRUSTED) */}
        <div className='flex bg-gray-800 rounded-xl p-1'>
          {(["admin", "employee"] as Role[]).map((r) => (
            <button
              key={r}
              onClick={() => handleChange("role", r)}
              className={`flex-1 py-2 rounded-lg text-sm transition ${
                formData.role === r
                  ? "bg-blue-600"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {r === "admin" ? "Admin" : "Employee"}
            </button>
          ))}
        </div>

        {/* INPUTS */}
        <div className='space-y-4'>
          {/* EMAIL */}
          <div className='relative'>
            <Icons.User
              className='absolute left-3 top-3 text-gray-400'
              size={18}
            />
            <input
              type='email'
              placeholder='Email'
              value={formData.email}
              onChange={(e) =>
                handleChange("email", e.target.value)
              }
              className='w-full pl-10 p-3 bg-gray-800/80 border border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition'
            />
          </div>

          {/* PASSWORD */}
          <div className='relative'>
            <Icons.Shield
              className='absolute left-3 top-3 text-gray-400'
              size={18}
            />
            <input
              type='password'
              placeholder='Password'
              value={formData.password}
              onChange={(e) =>
                handleChange("password", e.target.value)
              }
              className='w-full pl-10 p-3 bg-gray-800/80 border border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition'
            />
          </div>
        </div>

        {/* LOGIN BUTTON */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className='w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:scale-105 transition font-medium disabled:opacity-50'
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* FOOTER */}
        {formData.role === "admin" && (
          <p className='text-center text-gray-400 text-sm'>
            Don’t have an account?{" "}
            <span
              onClick={() => navigate("/register")}
              className='text-blue-400 cursor-pointer hover:underline'
            >
              Create one
            </span>
          </p>
        )}
      </motion.div>
    </div>
  );
}

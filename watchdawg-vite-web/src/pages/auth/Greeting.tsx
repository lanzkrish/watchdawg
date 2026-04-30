/** @format */

import { Icons } from "@/components/icons";
import { useAuthStore } from "@/store/auth.store";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  type: "login" | "register";
}

export default function Greeting({ type }: Props) {
  const navigate = useNavigate();

  /* 🔥 GET ROLE FROM GLOBAL STORE */
  const { user } = useAuthStore();
  const role = user?.role;

  /* ============================== */
  /* 🔁 REDIRECT LOGIC (FIXED)      */
  /* ============================== */

  useEffect(() => {
    if (!role) return; // ⛔ wait until user is available

    const timer = setTimeout(() => {
      switch (role) {
        case "admin":
          navigate("/admin/dashboard");
          break;

        case "employee":
          navigate("/employee/dashboard");
          break;

        case "superadmin":
          navigate("/super-admin/dashboard");
          break;

        default:
          navigate("/login"); // fallback safety
      }
    }, 1500); // smoother UX

    return () => clearTimeout(timer);
  }, [navigate, role]);

  /* ============================== */
  /* 🧠 MESSAGE                    */
  /* ============================== */

  const getMessage = () => {
    if (!role) return "Loading...";

    if (type === "register" && role === "admin") {
      return "Organization Created Successfully 🚀";
    }

    if (type === "login" && role === "admin") {
      return "Welcome Back, Admin 👑";
    }

    if (type === "login" && role === "employee") {
      return "Welcome Back 👋";
    }

    if (type === "login" && role === "superadmin") {
      return "Welcome Back, Owner 🔥";
    }

    return "Welcome to Watchdawg";
  };

  /* ============================== */
  /* 🎨 UI                         */
  /* ============================== */

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-900/60 backdrop-blur-xl border border-gray-700/50 p-10 rounded-3xl shadow-2xl text-center space-y-6"
      >
        {/* 🔥 ICON */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="flex justify-center"
        >
          {role === "admin" ? (
            <Icons.Shield size={50} className="text-blue-400" />
          ) : role === "superadmin" ? (
            <Icons.Crown size={50} className="text-yellow-400" />
          ) : (
            <Icons.User size={50} className="text-green-400" />
          )}
        </motion.div>

        {/* 🔥 MESSAGE */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-2xl font-semibold"
        >
          {getMessage()}
        </motion.h1>

        {/* 🔥 SUBTEXT */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-gray-400 text-sm"
        >
          Preparing your dashboard...
        </motion.p>

        {/* 🔥 LOADER */}
        <motion.div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.5 }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}

/** @format */

import { Icons } from "@/components/icons";
import { adminSidebar } from "@/components/sidebar/config/adminSidebarConfig";
import { employeeSidebar } from "@/components/sidebar/config/employeeSidebarConfig";
import { superAdminSidebar } from "./config/superAdminSidebarConfig";
import SidebarItem from "./SidebarItem";

import { motion } from "framer-motion";
import React, { useEffect, useMemo, useState } from "react";

type Role = "admin" | "employee" | "superadmin";

interface Props {
  role?: Role;
}

function Sidebar({ role = "admin" }: Props) {
  const [expanded, setExpanded] = useState(true);

  /* ============================== */
  /* 📱 RESPONSIVE HANDLER          */
  /* ============================== */

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setExpanded(false);
      }
    };

    handleResize(); // run once
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* ============================== */
  /* 🧠 MEMO MENU                  */
  /* ============================== */

  const menu = useMemo(() => {
    if (role === "admin") return adminSidebar;
    if (role === "employee") return employeeSidebar;
    return superAdminSidebar;
  }, [role]);

  /* ============================== */
  /* 🎯 UI                          */
  /* ============================== */

  return (
    <motion.div
      animate={{ width: expanded ? 260 : 80 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="min-h-screen bg-gray-900 border-r border-gray-800 flex flex-col overflow-hidden"
    >
      {/* HEADER */}
      <div className="flex items-center px-4 pt-5 mb-8 relative">
        {/* TITLE */}
        <motion.h1
          animate={{
            opacity: expanded ? 1 : 0,
            x: expanded ? 0 : -20,
          }}
          transition={{ duration: 0.2 }}
          className="text-xl font-bold absolute left-4"
        >
          WatchDawG
        </motion.h1>

        {/* TOGGLE */}
        <motion.button
          onClick={() => setExpanded((prev) => !prev)}
          animate={{
            x: expanded ? 200 : 0,
          }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="p-2 rounded-lg hover:bg-gray-800 transition z-10"
        >
          {expanded ? (
            <Icons.CornerUpLeft size={18} />
          ) : (
            <Icons.CornerUpRight size={18} />
          )}
        </motion.button>
      </div>

      {/* MENU */}
      <div className="flex-1 px-2 space-y-2">
        {menu.map((item) => (
          <SidebarItem
            key={item.path || item.label} // ✅ FIXED KEY
            item={item}
            expanded={expanded}
          />
        ))}
      </div>

      {/* FOOTER */}
      <motion.div
        animate={{ opacity: expanded ? 1 : 0 }}
        className="px-4 pb-4 text-gray-500 text-sm"
      >
        {expanded &&
          (role === "admin"
            ? "Admin Panel"
            : role === "employee"
            ? "Employee Panel"
            : "Super Admin")}
      </motion.div>
    </motion.div>
  );
}

/* ============================== */
/* 🔥 PREVENT RE-RENDER           */
/* ============================== */

export default React.memo(Sidebar);

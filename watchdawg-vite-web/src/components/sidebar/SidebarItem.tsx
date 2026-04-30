/** @format */

import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import type { SidebarItemType } from "./config/sidebarConfig";

interface Props {
  item: SidebarItemType;
  expanded: boolean;
}

export default function SidebarItem({ item, expanded }: Props) {
  const Icon = item.icon;
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ FIXED ACTIVE LOGIC
  const isActive =
    location.pathname === item.path ||
    location.pathname.startsWith(item.path + "/");

  return (
    <div
      onClick={() => navigate(item.path)}
      className={`
        relative flex items-center px-3 py-3 rounded-xl cursor-pointer transition
        ${expanded ? "gap-3 justify-start" : "justify-center"}
        ${isActive ? "bg-gray-800/60" : "hover:bg-gray-800"}
      `}
    >
      {/* 🔥 Active Indicator */}
      {isActive && (
        <motion.div
          layoutId="active-pill"
          className="absolute left-0 top-1 bottom-1 w-1 bg-blue-500 rounded-r"
        />
      )}

      {/* Icon */}
      <div className="w-6 flex justify-center">
        <Icon
          size={20}
          className={`transition ${
            isActive ? "text-blue-400" : "text-gray-400"
          }`}
        />
      </div>

      {/* Label */}
      <span
        className={`
          text-sm whitespace-nowrap transition-all duration-300
          ${
            expanded
              ? "opacity-100 translate-x-0"
              : "opacity-0 -translate-x-2 pointer-events-none absolute"
          }
        `}
      >
        {item.label}
      </span>
    </div>
  );
}

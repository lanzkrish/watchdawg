/** @format */

import { Icons } from "@/components/icons";

export const superAdminSidebar = [
  {
    label: "Dashboard",
    path: "/super-admin/dashboard",
    icon: Icons.LayoutDashboard, // 🔥 better than Home
  },
  {
    label: "Organizations",
    path: "/super-admin/organizations",
    icon: Icons.Building2, // 🔥 companies icon
  },
  {
    label: "Revenue",
    path: "/super-admin/revenue",
    icon: Icons.TrendingUp, // 🔥 revenue growth
  },
  {
    label: "System",
    path: "/super-admin/system",
    icon: Icons.Activity, // 🔥 logs + system monitoring
  },
  {
    label: "Settings",
    path: "/super-admin/settings",
    icon: Icons.Sliders, // 🔥 better than generic settings
  },
];

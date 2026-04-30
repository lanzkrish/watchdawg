/** @format */

import { Icons } from "@/components/icons";
import type { SidebarItemType } from "@/components/sidebar/config/sidebarConfig";

export const adminSidebar: SidebarItemType[] = [
  { label: "Dashboard", path: "/admin/dashboard", icon: Icons.Home },
  { label: "Live Monitoring", path: "/admin/live-monitoring", icon: Icons.Activity },
  { label: "Employees", path: "/admin/employees", icon: Icons.Users },
  { label: "Reports", path: "/admin/reports", icon: Icons.PieChart },
  { label: "Settings", path: "/admin/settings", icon: Icons.Settings },
];

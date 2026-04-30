/** @format */

export interface DashboardStats {
  totalCompanies: number;
  totalUsers: number;
  monthlyRevenue: number;
  systemUptime: number;
}

export interface RevenuePoint {
  month: string;
  revenue: number;
}

export interface ActivityItem {
  type: string;
  message: string;
  time: string;
}

export interface SystemHealth {
  apiServer: string;
  database: string;
  storageUsed: string;
}

export interface DashboardData {
  stats: DashboardStats;
  revenueGraph: RevenuePoint[];
  recentActivity: ActivityItem[];
  systemHealth: SystemHealth;
}

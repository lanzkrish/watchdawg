/** @format */

export interface RevenueStats {
  totalRevenue: number;
  monthlyRevenue: number;
  arpu: number;
  growth: number;
}

export interface RevenuePoint {
  date: string;
  revenue: number;
}

export interface ProductivityPoint {
  date: string;
  productivity: number;
}

export interface CompanyRevenue {
  company: string;
  users: number;
  revenue: number;
}

export interface TopCompany {
  company: string;
  revenue: number;
  productivity: number;
}

export interface RevenueData {
  stats: RevenueStats;
  revenueChart: RevenuePoint[];
  productivityTrend: ProductivityPoint[];
  revenueByCompany: CompanyRevenue[];
  topCompanies: TopCompany[];
}

/** @format */

import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';

@Injectable()
export class DashboardService {
  constructor(private db: DatabaseService) {}

  async getDashboardData() {
    const [stats, revenueGraph, recentActivity, systemHealth] =
      await Promise.all([
        this.getStats(),
        this.getRevenueGraph(),
        this.getRecentActivity(),
        this.getSystemHealth(),
      ]);

    return {
      stats,
      revenueGraph,
      recentActivity,
      systemHealth,
    };
  }

  /* ================================================= */
  /* 📊 STATS                                           */
  /* ================================================= */

  private async getStats() {
    const companies = await this.db.query(`SELECT COUNT(*) FROM organization`);

    const users = await this.db.query(
      `SELECT COUNT(*) FROM users
WHERE role IN ('admin', 'employee')`,
    );

    // Example revenue (you can replace later with real billing)
    const revenue = await this.db.query(`
      SELECT SUM(100) as revenue FROM organization
    `);

    return {
      totalCompanies: Number(companies.rows[0].count),
      totalUsers: Number(users.rows[0].count),
      monthlyRevenue: Number(revenue.rows[0].revenue || 0),
      systemUptime: process.uptime(), // seconds
    };
  }

  /* ================================================= */
  /* 📈 REVENUE GRAPH                                   */
  /* ================================================= */

  private async getRevenueGraph() {
    // mock monthly data (replace with real billing later)
    return [
      { month: 'Jan', revenue: 5000 },
      { month: 'Feb', revenue: 7000 },
      { month: 'Mar', revenue: 9000 },
      { month: 'Apr', revenue: 12000 },
    ];
  }

  /* ================================================= */
  /* 📜 RECENT ACTIVITY                                 */
  /* ================================================= */

  private async getRecentActivity() {
    return [
      {
        type: 'company',
        message: 'New company registered',
        time: new Date(),
      },
      {
        type: 'deployment',
        message: 'Server update deployed',
        time: new Date(),
      },
      {
        type: 'revenue',
        message: 'Revenue milestone reached',
        time: new Date(),
      },
    ];
  }

  /* ================================================= */
  /* 🩺 SYSTEM HEALTH                                   */
  /* ================================================= */

  private async getSystemHealth() {
    let dbStatus = 'healthy';

    try {
      await this.db.query('SELECT 1');
    } catch {
      dbStatus = 'down';
    }

    return {
      apiServer: 'online',
      database: dbStatus,
      storageUsed: '45%', // mock (replace with real later)
    };
  }
}

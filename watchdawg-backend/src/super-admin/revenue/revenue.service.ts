/** @format */

import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';

@Injectable()
export class RevenueService {
  constructor(private db: DatabaseService) {}

  async getRevenueData() {
    const [
      stats,
      revenueChart,
      productivityTrend,
      revenueByCompany,
      topCompanies,
    ] = await Promise.all([
      this.getStats(),
      this.getRevenueChart(),
      this.getProductivityTrend(),
      this.getRevenueByCompany(),
      this.getTopCompanies(),
    ]);

    return {
      stats,
      revenueChart,
      productivityTrend,
      revenueByCompany,
      topCompanies,
    };
  }

  /* ================================================= */
  /* 💰 STATS                                          */
  /* ================================================= */

  private async getStats() {
    const users = await this.db.query(
      `SELECT COUNT(*) FROM users WHERE role!='superadmin'`,
    );

    const totalUsers = Number(users.rows[0].count);
    const pricePerUser = 100; // ₹100/month

    const totalRevenue = totalUsers * pricePerUser;

    return {
      totalRevenue,
      monthlyRevenue: totalRevenue,
      arpu: pricePerUser,
      growth: 12, // mock (can calculate later)
    };
  }

  /* ================================================= */
  /* 📈 REVENUE CHART (LAST 7 DAYS)                    */
  /* ================================================= */

  private async getRevenueChart() {
    const result = await this.db.query(`
      SELECT
        DATE(created_at) as date,
        COUNT(*) * 100 as revenue
      FROM users
      WHERE created_at >= NOW() - INTERVAL '7 days'
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `);

    return result.rows;
  }

  /* ================================================= */
  /* 📈 PRODUCTIVITY TREND                             */
  /* ================================================= */

  private async getProductivityTrend() {
    const result = await this.db.query(`
      SELECT
        DATE(created_at) as date,
        AVG(productivity_score) as productivity
      FROM activity
      WHERE created_at >= NOW() - INTERVAL '7 days'
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `);

    return result.rows.map((r) => ({
      date: r.date,
      productivity: Number(r.productivity),
    }));
  }

  /* ================================================= */
  /* 🏢 REVENUE BY COMPANY                            */
  /* ================================================= */

  private async getRevenueByCompany() {
    const result = await this.db.query(`
      SELECT
        o.name as company,
        COUNT(u.id) as users,
        COUNT(u.id) * 100 as revenue
      FROM organization o
      LEFT JOIN users u ON u.organization_id = o.id
      GROUP BY o.id
      ORDER BY revenue DESC
    `);

    return result.rows.map((r) => ({
      company: r.company,
      users: Number(r.users),
      revenue: Number(r.revenue),
    }));
  }

  /* ================================================= */
  /* 🏆 TOP COMPANIES                                 */
  /* ================================================= */

  private async getTopCompanies() {
    const result = await this.db.query(`
      SELECT
        o.name as company,
        COUNT(u.id) * 100 as revenue,
        AVG(a.productivity_score) as productivity
      FROM organization o
      LEFT JOIN users u ON u.organization_id = o.id
      LEFT JOIN activity a ON a.user_id = u.id
      GROUP BY o.id
      ORDER BY revenue DESC
      LIMIT 5
    `);

    return result.rows.map((r) => ({
      company: r.company,
      revenue: Number(r.revenue),
      productivity: Number(r.productivity || 0),
    }));
  }
}

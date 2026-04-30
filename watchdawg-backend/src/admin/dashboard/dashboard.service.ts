/** @format */

import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';

@Injectable()
export class AdminDashboardService {
  constructor(private db: DatabaseService) {}

  async getDashboard(adminId: string) {
    const [stats, productivityTrend, employeeActivity] = await Promise.all([
      this.getStats(adminId),
      this.getProductivityTrend(adminId),
      this.getEmployeeActivity(adminId),
    ]);

    return {
      stats,
      productivityTrend,
      employeeActivity,
    };
  }

  /* ================================================= */
  /* 📊 STATS                                           */
  /* ================================================= */

  private async getStats(adminId: string) {
    const org = await this.db.query(
      `SELECT organization_id FROM users WHERE id = $1`,
      [adminId],
    );

    if (!org.rows.length) {
      throw new Error('Admin not found');
    }

    const orgId = org.rows[0].organization_id;

    const active = await this.db.query(
      `
      SELECT COUNT(*) FROM users
      WHERE organization_id = $1 AND role = 'employee'
    `,
      [orgId],
    );

    // ✅ FIXED TABLE
    const productivity = await this.db.query(
      `
      SELECT AVG(productivity_score) as avg
      FROM activity_daily
      WHERE user_id IN (
        SELECT id FROM users WHERE organization_id = $1
      )
    `,
      [orgId],
    );

    const avg = Number(productivity.rows[0]?.avg || 0);

    const idle = 100 - avg;

    const live = await this.db.query(
      `
      SELECT COUNT(*) FROM users
      WHERE organization_id = $1
      AND NOW() - last_seen < INTERVAL '30 seconds'
    `,
      [orgId],
    );

    return {
      activeEmployees: Number(active.rows[0].count),
      productivity: Math.round(avg), // ✅ number
      idleTime: Math.round(idle),
      liveSessions: Number(live.rows[0].count),
    };
  }

  /* ================================================= */
  /* 📈 PRODUCTIVITY TREND                              */
  /* ================================================= */

  private async getProductivityTrend(adminId: string) {
    const result = await this.db.query(`
      SELECT
        TO_CHAR(date, 'Dy') as day,
        AVG(productivity_score) as value
      FROM activity_daily
      WHERE date >= CURRENT_DATE - INTERVAL '7 days'
      GROUP BY day, date
      ORDER BY date
    `);

    return result.rows.map((r) => ({
      day: r.day,
      value: Number(r.value),
    }));
  }

  /* ================================================= */
  /* 👥 EMPLOYEE ACTIVITY                               */
  /* ================================================= */

  private async getEmployeeActivity(adminId: string) {
    const result = await this.db.query(`
      SELECT
        u.id as "userId", -- 🔥 CRITICAL FIX
        u.full_name as name,

        CASE
          WHEN NOW() - u.last_seen < INTERVAL '30 seconds'
          THEN 'Active'
          ELSE 'Idle'
        END as status,

        COALESCE(AVG(a.productivity_score), 0) as productivity

      FROM users u
      LEFT JOIN activity_daily a ON a.user_id = u.id

      WHERE u.role = 'employee'

      GROUP BY u.id
      ORDER BY productivity DESC
      LIMIT 5
    `);

    return result.rows.map((r) => ({
      userId: r.userId, // 🔥 REQUIRED
      name: r.name,
      status: r.status,
      productivity: Math.round(Number(r.productivity)),
    }));
  }
}

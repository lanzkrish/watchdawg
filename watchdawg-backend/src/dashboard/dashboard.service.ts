/** @format */

import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class DashboardService {
  constructor(private db: DatabaseService) {}

  /* ================================================= */
  /* 👑 ADMIN DASHBOARD                                */
  /* ================================================= */

  async getAdminDashboard(adminId: string) {
    const totalEmployees = await this.db.query(
      `SELECT COUNT(*) FROM users
       WHERE role = 'employee'
       AND organization_id = (
         SELECT organization_id FROM users WHERE id = $1
       )`,
      [adminId],
    );

    const activeNow = await this.db.query(
      `SELECT COUNT(*) FROM activity a
       JOIN users u ON a.user_id = u.id
       WHERE a.is_active = true
       AND u.organization_id = (
         SELECT organization_id FROM users WHERE id = $1
       )`,
      [adminId],
    );

    const productivity = await this.db.query(
      `SELECT AVG(productivity_score) FROM activity a
       JOIN users u ON a.user_id = u.id
       WHERE u.organization_id = (
         SELECT organization_id FROM users WHERE id = $1
       )`,
      [adminId],
    );

    return {
      totalEmployees: Number(totalEmployees.rows[0].count),
      activeNow: Number(activeNow.rows[0].count),
      avgProductivity: Number(productivity.rows[0].avg) || 0,
    };
  }

  /* ================================================= */
  /* 👨‍💻 EMPLOYEE DASHBOARD                           */
  /* ================================================= */

  async getEmployeeDashboard(userId: string) {
    const todayActivity = await this.db.query(
      `SELECT SUM(duration) as total_time,
              AVG(productivity_score) as productivity
       FROM activity
       WHERE user_id = $1`,
      [userId],
    );

    const appUsage = await this.db.query(
      `SELECT app_name, SUM(duration) as total
       FROM app_usage
       WHERE user_id = $1
       GROUP BY app_name
       ORDER BY total DESC`,
      [userId],
    );

    return {
      totalTime: Number(todayActivity.rows[0].total_time) || 0,
      productivity: Number(todayActivity.rows[0].productivity) || 0,
      topApps: appUsage.rows,
    };
  }
}

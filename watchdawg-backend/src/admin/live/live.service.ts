/** @format */

import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';

@Injectable()
export class LiveService {
  constructor(private db: DatabaseService) {}

  async getLiveData() {
    const [employees, activity] = await Promise.all([
      this.getLiveEmployees(),
      this.getActivityFeed(),
    ]);

    return {
      liveEmployees: employees,
      activityFeed: activity,
    };
  }

  /* ================================================= */
  /* 👥 LIVE EMPLOYEES                                 */
  /* ================================================= */

  private async getLiveEmployees() {
    const result = await this.db.query(`
      SELECT
        u.full_name,
        u.id,
        a.current_app,
        a.last_active,
        a.status
      FROM users u
      LEFT JOIN activity a ON a.user_id = u.id
      WHERE u.role = 'employee'
      ORDER BY a.last_active DESC
      LIMIT 10
    `);

    return result.rows.map((r) => {
      const minutes = Math.floor(
        (Date.now() - new Date(r.last_active).getTime()) / 60000,
      );

      return {
        name: r.full_name,
        currentApp: r.current_app || 'Unknown',
        status: r.status || 'idle',
        activeFor: `${minutes} min`,
      };
    });
  }

  /* ================================================= */
  /* 📜 ACTIVITY FEED                                  */
  /* ================================================= */

  private async getActivityFeed() {
    const result = await this.db.query(`
      SELECT
        u.full_name,
        a.action,
        a.created_at
      FROM activity a
      JOIN users u ON u.id = a.user_id
      ORDER BY a.created_at DESC
      LIMIT 10
    `);

    return result.rows.map((r) => ({
      message: `${r.full_name} ${r.action}`,
      time: r.created_at,
    }));
  }
}

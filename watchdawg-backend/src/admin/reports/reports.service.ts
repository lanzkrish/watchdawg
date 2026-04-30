/** @format */

import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';

@Injectable()
export class AdminReportsService {
  constructor(private db: DatabaseService) {}

  /* ================================================= */
  /* 📜 GET REPORT LIST                                */
  /* ================================================= */

  async getReports() {
    return [
      {
        id: 'weekly',
        title: 'Weekly Productivity Report',
        date: '2026-04-10',
      },
      {
        id: 'employee',
        title: 'Employee Performance Report',
        date: '2026-04-08',
      },
      {
        id: 'system',
        title: 'System Usage Report',
        date: '2026-04-05',
      },
    ];
  }

  /* ================================================= */
  /* 📄 GENERATE REPORT                                */
  /* ================================================= */

  async generateReport(type: string) {
    if (type === 'weekly') {
      const data = await this.db.query(`
        SELECT
          u.full_name,
          COUNT(a.id) as actions,
          AVG(
            CASE
              WHEN a.status = 'active' THEN 80
              ELSE 40
            END
          ) as productivity
        FROM users u
        LEFT JOIN activity a ON a.user_id = u.id
        WHERE u.role = 'employee'
        GROUP BY u.id
      `);

      return {
        name: 'weekly-report.json',
        data: data.rows,
      };
    }

    if (type === 'employee') {
      const data = await this.db.query(`
        SELECT
          u.full_name,
          COUNT(a.id) as total_activity,
          MAX(a.last_active) as last_seen
        FROM users u
        LEFT JOIN activity a ON a.user_id = u.id
        WHERE u.role = 'employee'
        GROUP BY u.id
      `);

      return {
        name: 'employee-report.json',
        data: data.rows,
      };
    }

    if (type === 'system') {
      const data = await this.db.query(`
        SELECT
          current_app,
          COUNT(*) as usage_count
        FROM activity
        GROUP BY current_app
        ORDER BY usage_count DESC
      `);

      return {
        name: 'system-report.json',
        data: data.rows,
      };
    }

    return {
      name: 'report.json',
      data: [],
    };
  }
}

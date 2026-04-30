/** @format */

import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';

@Injectable()
export class EmployeeReportsService {
  constructor(private db: DatabaseService) {}

  /* ================================================= */
  /* 🚀 OVERVIEW (MAIN REPORT PAGE API)                */
  /* ================================================= */

  async getOverview(userId: string) {
    /* ============================== */
    /* 🔥 TOTAL TIME (ALL DAYS)       */
    /* ============================== */

    const totalsRes = await this.db.query(
      `
      SELECT
        SUM(CASE WHEN status='active' THEN duration ELSE 0 END) as active,
        SUM(CASE WHEN status='idle' THEN duration ELSE 0 END) as idle,
        SUM(CASE WHEN status='away' THEN duration ELSE 0 END) as away
      FROM activity_logs
      WHERE user_id = $1
      `,
      [userId],
    );

    const totals = {
      active: Number(totalsRes.rows[0]?.active || 0),
      idle: Number(totalsRes.rows[0]?.idle || 0),
      away: Number(totalsRes.rows[0]?.away || 0),
    };

    /* ============================== */
    /* 🔥 APP USAGE (ONLY ACTIVE)     */
    /* ============================== */

    const appsRes = await this.db.query(
      `
      SELECT app_name, SUM(duration) as total
      FROM activity_logs
      WHERE user_id = $1 AND status='active'
      GROUP BY app_name
      ORDER BY total DESC
      `,
      [userId],
    );

    const apps: Record<string, number> = {};
    appsRes.rows.forEach((row) => {
      apps[row.app_name] = Number(row.total);
    });

    /* ============================== */
    /* 🔥 HEATMAP TREND (FIXED TZ)    */
    /* ============================== */

    const trendRes = await this.db.query(
      `
      SELECT
        DATE(created_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Kolkata') as date,
        SUM(duration) as total
      FROM activity_logs
      WHERE user_id = $1
      GROUP BY DATE(created_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Kolkata')
      ORDER BY date ASC
      `,
      [userId],
    );

    const trend = trendRes.rows.map((r) => ({
      date: r.date,
      total: Number(r.total),
    }));

    /* ============================== */
    /* 🎯 PRODUCTIVITY                */
    /* ============================== */

    const totalTime = totals.active + totals.idle + totals.away;

    const productivity =
      totalTime > 0 ? Math.round((totals.active / totalTime) * 100) : 0;

    return {
      totals,
      apps,
      trend,
      productivity,
    };
  }

  /* ================================================= */
  /* 📊 REPORT LIST (DOWNLOAD SECTION)                 */
  /* ================================================= */

  async getMyReports(userId: string) {
    const result = await this.db.query(
      `
      SELECT
        DATE(created_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Kolkata') as date,
        SUM(duration) as total_time,
        SUM(CASE WHEN status='active' THEN duration ELSE 0 END) as active_time,
        SUM(CASE WHEN status='idle' THEN duration ELSE 0 END) as idle_time,
        SUM(CASE WHEN status='away' THEN duration ELSE 0 END) as away_time
      FROM activity_logs
      WHERE user_id = $1
      GROUP BY DATE(created_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Kolkata')
      ORDER BY date DESC
      `,
      [userId],
    );

    return result.rows.map((r) => ({
      date: r.date,
      total: Number(r.total_time),
      active: Number(r.active_time),
      idle: Number(r.idle_time),
      away: Number(r.away_time),
    }));
  }

  /* ================================================= */
  /* ⬇️ DOWNLOAD REPORT (CSV)                          */
  /* ================================================= */

  async downloadReport(date: string, userId: string) {
    const result = await this.db.query(
      `
      SELECT
        app_name,
        window_title,
        url,
        category,
        status,
        duration,
        created_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Kolkata' as time
      FROM activity_logs
      WHERE user_id = $1
        AND DATE(created_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Kolkata') = $2
      ORDER BY created_at ASC
      `,
      [userId, date],
    );

    if (!result.rows.length) {
      throw new NotFoundException('No data found for this date');
    }

    const headers = [
      'App',
      'Window',
      'URL',
      'Category',
      'Status',
      'Duration(sec)',
      'Time',
    ];

    const rows = result.rows.map((r) => [
      r.app_name,
      r.window_title,
      r.url,
      r.category,
      r.status,
      r.duration,
      new Date(r.time).toLocaleTimeString('en-IN'),
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((v) => `"${v ?? ''}"`).join(','))
      .join('\n');

    return {
      filename: `report-${date}.csv`,
      content: csv,
    };
  }
}

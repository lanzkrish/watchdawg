/** @format */

import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';

@Injectable()
export class EmployeeActivityService {
  constructor(private db: DatabaseService) {}

  async getMyActivity(userId: string) {
    /* ============================== */
    /* 🎯 FOREGROUND (MAIN)           */
    /* ============================== */

    const mainRes = await this.db.query(
      `
      SELECT
        user_id,
        organization_id,
        app,
        title,
        platform,
        category,
        status,
        duration,
        start_time
      FROM activities
      WHERE user_id = $1
      ORDER BY start_time DESC
      LIMIT 100
      `,
      [userId],
    );

    /* ============================== */
    /* 🎵 BACKGROUND (OPTIONAL)       */
    /* ============================== */

    const bgRes = await this.db.query(
      `
      SELECT
        user_id,
        app,
        type,
        duration,
        start_time
      FROM background_activities
      WHERE user_id = $1
      ORDER BY start_time DESC
      LIMIT 100
      `,
      [userId],
    );

    const mainRows = mainRes.rows;
    const bgRows = bgRes.rows;

    if (!mainRows.length) return [];

    /* ============================== */
    /* 🧠 MAP BACKGROUND BY TIME      */
    /* ============================== */

    const bgMap = new Map<number, any>();

    bgRows.forEach((bg) => {
      const key = new Date(bg.start_time).getTime();

      bgMap.set(key, {
        platform: bg.app,
        category: mapBackgroundCategory(bg.type),
        duration: Number(bg.duration),
      });
    });

    /* ============================== */
    /* 🔥 FINAL MERGE                 */
    /* ============================== */

    return mainRows.map((row) => {
      const timestamp = new Date(row.start_time).getTime();

      return {
        userId: row.user_id,
        organizationId: row.organization_id,

        app: row.app,
        title: row.title || '-',

        platform: row.platform || 'Unknown',
        category: row.category || 'neutral',

        status: row.status,
        duration: Number(row.duration) || 0,

        timestamp,

        source: 'agent',

        /* 🔥 OPTIONAL BACKGROUND */
        background: bgMap.get(timestamp) || null,
      };
    });
  }
}

/* ============================== */
/* 🎯 CATEGORY MAP                */
/* ============================== */

function mapBackgroundCategory(type: string) {
  if (type === 'music') return 'distracting';
  return 'neutral';
}

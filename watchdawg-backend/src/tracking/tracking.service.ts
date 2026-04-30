/** @format */

import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class TrackingService {
  constructor(private db: DatabaseService) {}

  async logActivity(data: any) {
    console.log('📥 Incoming activity:', JSON.stringify(data, null, 2));

    const {
      userId,
      organizationId,
      app,
      title,
      platform,
      domain,
      category,
      status,
      duration,
      background,
      timestamp,
    } = data;

    /* ============================== */
    /* 🔒 VALIDATION                  */
    /* ============================== */

    if (!userId || !organizationId) {
      throw new Error('Missing userId or organizationId');
    }

    if (!app || typeof app !== 'string') {
      throw new Error('Invalid app');
    }

    if (!duration || duration <= 0) {
      throw new Error('Invalid duration');
    }

    /* ============================== */
    /* 🧼 CLEAN DATA                  */
    /* ============================== */

    const cleanTitle =
      typeof title === 'string' && title.trim()
        ? title.trim().slice(0, 255)
        : null;

    const cleanPlatform =
      typeof platform === 'string' && platform.trim()
        ? platform.trim()
        : 'Unknown';

    const cleanDomain =
      typeof domain === 'string' && domain.trim() ? domain.trim() : '';

    const cleanCategory = ['productive', 'neutral', 'distracting'].includes(
      category,
    )
      ? category
      : 'neutral';

    const cleanStatus = ['active', 'idle', 'away'].includes(status)
      ? status
      : 'active';

    /* ============================== */
    /* ⏱ TIME CALCULATION            */
    /* ============================== */

    const endTime = new Date(timestamp || Date.now());
    const startTime = new Date(endTime.getTime() - duration * 1000);

    try {
      /* ============================== */
      /* 🚀 MAIN ACTIVITY               */
      /* ============================== */

      await this.db.query(
        `
        INSERT INTO activities (
          user_id,
          organization_id,
          app,
          title,
          platform,
          domain,
          category,
          status,
          duration,
          start_time,
          end_time
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
        `,
        [
          userId,
          organizationId,
          app.trim(),
          cleanTitle,
          cleanPlatform,
          cleanDomain,
          cleanCategory,
          cleanStatus,
          duration,
          startTime,
          endTime,
        ],
      );

      /* ============================== */
      /* 🎵 BACKGROUND MUSIC            */
      /* ============================== */

      if (
        background &&
        background.app &&
        typeof background.duration === 'number' &&
        background.duration > 0
      ) {
        const bgEnd = new Date(timestamp || Date.now());
        const bgStart = new Date(bgEnd.getTime() - background.duration * 1000);

        await this.db.query(
          `
          INSERT INTO background_activities (
            user_id,
            organization_id,
            app,
            type,
            duration,
            start_time,
            end_time
          )
          VALUES ($1,$2,$3,$4,$5,$6,$7)
          `,
          [
            userId,
            organizationId,
            background.app,
            background.type || 'music',
            background.duration,
            bgStart,
            bgEnd,
          ],
        );
      }

      /* ============================== */
      /* 📊 DAILY AGGREGATION           */
      /* ============================== */

      await this.db.query(
        `
        INSERT INTO activity_daily (
          user_id,
          organization_id,
          date,
          app_name,
          platform,
          category,
          total_duration
        )
        VALUES ($1,$2,CURRENT_DATE,$3,$4,$5,$6)

        ON CONFLICT (user_id, date, app_name, platform, category)
        DO UPDATE SET
          total_duration = activity_daily.total_duration + EXCLUDED.total_duration
        `,
        [
          userId,
          organizationId,
          app.trim(),
          cleanPlatform,
          cleanCategory,
          duration,
        ],
      );

      console.log(
        `✅ Saved: ${app} | ${cleanPlatform} | ${cleanCategory} | ${duration}s`,
      );
    } catch (err: any) {
      console.error('❌ DB Error:', err.message || err);
      throw err;
    }
  }
}

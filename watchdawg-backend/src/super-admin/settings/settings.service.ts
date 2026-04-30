/** @format */

import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';

@Injectable()
export class SettingsService {
  constructor(private db: DatabaseService) {}

  /* ================================================= */
  /* 📥 GET SETTINGS                                   */
  /* ================================================= */

  async getAllSettings() {
    const result = await this.db.query(`
      SELECT key, value FROM settings
    `);

    const settings = {};

    for (const row of result.rows) {
      settings[row.key] = row.value;
    }

    return {
      success: true,
      data: settings,
    };
  }

  /* ================================================= */
  /* ✏️ UPDATE SETTINGS                                */
  /* ================================================= */

  async updateSettings(data: Record<string, any>) {
    const queries = Object.entries(data).map(([key, value]) =>
      this.db.query(
        `
        INSERT INTO settings (key, value)
        VALUES ($1, $2)
        ON CONFLICT (key)
        DO UPDATE SET value = $2, updated_at = NOW()
        `,
        [key, String(value)],
      ),
    );

    await Promise.all(queries);

    return {
      success: true,
      message: 'Settings updated successfully',
    };
  }
}

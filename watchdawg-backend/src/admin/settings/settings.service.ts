/** @format */

import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';

@Injectable()
export class AdminSettingsService {
  constructor(private db: DatabaseService) {}

  /* ================================================= */
  /* 📥 GET SETTINGS                                   */
  /* ================================================= */

  async getSettings(orgId: string) {
    const result = await this.db.query(
      `SELECT * FROM organization_settings WHERE organization_id = $1`,
      [orgId],
    );

    if (result.rows.length === 0) {
      // 🔥 create default settings
      await this.db.query(
        `INSERT INTO organization_settings (organization_id)
         VALUES ($1)`,
        [orgId],
      );

      return this.getSettings(orgId);
    }

    return result.rows[0];
  }

  /* ================================================= */
  /* ✏️ UPDATE SETTINGS                                */
  /* ================================================= */

  async updateSettings(orgId: string, data: any) {
    const keys = Object.keys(data);

    const updates = keys.map((key, i) => `${key} = $${i + 2}`);

    const values = Object.values(data);

    const query = `
      UPDATE organization_settings
      SET ${updates.join(', ')},
          updated_at = NOW()
      WHERE organization_id = $1
      RETURNING *
    `;

    const result = await this.db.query(query, [orgId, ...values]);

    return {
      success: true,
      data: result.rows[0],
    };
  }
}

/** @format */

import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class CategorizationService {
  constructor(private db: DatabaseService) {}

  async getCategory(app: string, url?: string): Promise<string> {
    if (!app) return 'neutral';

    const appName = app.toLowerCase();
    const site = url?.toLowerCase();

    // 🔥 DB RULES
    const dbResult = await this.db.query(
      `SELECT category FROM app_categories WHERE LOWER(name) = $1 LIMIT 1`,
      [appName],
    );

    if (dbResult.rows.length) {
      return dbResult.rows[0].category;
    }

    // 🌐 WEBSITE RULES
    if (site) {
      if (site.includes('youtube')) return 'unproductive';
      if (site.includes('netflix')) return 'unproductive';
      if (site.includes('instagram')) return 'unproductive';

      if (site.includes('github')) return 'productive';
      if (site.includes('stackoverflow')) return 'productive';
      if (site.includes('docs')) return 'productive';
    }

    // 💻 APP RULES
    if (appName.includes('code')) return 'productive';
    if (appName.includes('terminal')) return 'productive';
    if (appName.includes('figma')) return 'productive';

    if (appName.includes('game')) return 'unproductive';
    if (appName.includes('spotify')) return 'unproductive';

    return 'neutral';
  }

  async addCategory(name: string, category: string) {
    await this.db.query(
      `
      INSERT INTO app_categories (id, name, category)
      VALUES (gen_random_uuid(), $1, $2)
      `,
      [name.toLowerCase(), category],
    );

    return { message: 'Category added' };
  }

  async getAll() {
    const result = await this.db.query(`SELECT * FROM app_categories`);
    return result.rows;
  }

  async delete(name: string) {
    await this.db.query(`DELETE FROM app_categories WHERE LOWER(name) = $1`, [
      name.toLowerCase(),
    ]);

    return { message: 'Category removed' };
  }
}

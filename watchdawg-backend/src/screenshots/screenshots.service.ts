/** @format */

import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class ScreenshotsService {
  constructor(private db: DatabaseService) {}

  async saveScreenshot(data: any) {
    const { userId, organizationId, imageUrl } = data;

    if (!userId || !organizationId || !imageUrl) return;

    await this.db.query(
      `
      INSERT INTO screenshots
      (id, user_id, organization_id, image_url)
      VALUES (gen_random_uuid(), $1, $2, $3)
      `,
      [userId, organizationId, imageUrl],
    );
  }
}

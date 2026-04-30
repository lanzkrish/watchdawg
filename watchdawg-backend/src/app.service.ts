/** @format */

import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../src/database/database.service';

@Injectable()
export class AppService {
  constructor(private db: DatabaseService) {}

  async track(userId: string, body: any) {
    return this.db.query(
      `INSERT INTO app_usage (user_id, app_name, duration)
       VALUES ($1, $2, $3)`,
      [userId, body.appName, body.duration],
    );
  }
}

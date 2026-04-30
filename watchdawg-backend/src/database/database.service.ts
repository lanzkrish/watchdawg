import { Injectable, OnModuleInit } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class DatabaseService implements OnModuleInit {
  private pool: Pool;

  async onModuleInit() {
    this.pool = new Pool({
      host: 'localhost',
      port: 10000,
      user: 'watchdawg',
      password: 'watchdawg123',
      database: 'watchdawg_db',
    });

    await this.pool.connect();
    console.log('✅ DB Connected');
  }

  query(query: string, params?: any[]) {
    return this.pool.query(query, params);
  }
}

/** @format */

import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';

@Injectable()
export class OrganizationsService {
  constructor(private db: DatabaseService) {}

  async getAllOrganizations() {
    const result = await this.db.query(`
      SELECT
        o.id,
        o.name as company,
        o.admin_id,

        -- 👤 ADMIN NAME
        (SELECT full_name FROM users WHERE id = o.admin_id) as admin_name,

        -- 👥 TOTAL USERS (excluding superadmin)
        COUNT(u.id) as total_users

      FROM organization o

      LEFT JOIN users u
        ON u.organization_id = o.id
        AND u.role IN ('admin', 'employee')

      GROUP BY o.id

      ORDER BY o.created_at DESC
    `);

    return result.rows.map((r) => ({
      id: r.id,
      company: r.company,
      adminName: r.admin_name,
      totalUsers: Number(r.total_users),
      status: 'active', // later dynamic
    }));
  }
}

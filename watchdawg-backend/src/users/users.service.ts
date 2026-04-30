/** @format */

import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class UsersService {
  constructor(private readonly db: DatabaseService) {}

  /* ================================================= */
  /* 🔍 FIND USER BY EMAIL                             */
  /* ================================================= */

  async findByEmail(email: string) {
    const res = await this.db.query(`SELECT * FROM users WHERE email = $1`, [
      email,
    ]);

    return res.rows[0] || null;
  }

  /* ================================================= */
  /* 🔍 FIND USER BY ID                                */
  /* ================================================= */

  async findById(userId: string) {
    const res = await this.db.query(
      `
      SELECT
        id,
        full_name AS name,
        email,
        role,
        organization_id,
        is_active,
        access_enabled,
        designation,
        is_first_login
      FROM users
      WHERE id = $1
      `,
      [userId],
    );

    return res.rows[0] || null;
  }

  /* ================================================= */
  /* 🏢 GET ORGANIZATION ID                            */
  /* ================================================= */

  async getOrganizationId(userId: string): Promise<string> {
    const res = await this.db.query(
      `SELECT organization_id FROM users WHERE id = $1`,
      [userId],
    );

    if (!res.rows[0]) {
      throw new NotFoundException('User not found');
    }

    return res.rows[0].organization_id;
  }

  /* ================================================= */
  /* 📥 GET EMPLOYEES BY ORG                           */
  /* ================================================= */

  async getEmployeesByOrg(orgId: string) {
    const res = await this.db.query(
      `
      SELECT
        id,
        full_name AS name,
        email,
        role,
        designation,
        is_active,
        access_enabled,
        created_at
      FROM users
      WHERE role = 'employee'
      AND organization_id = $1
      ORDER BY created_at DESC
      `,
      [orgId],
    );

    return res.rows;
  }

  /* ================================================= */
  /* ➕ CREATE USER (GENERIC)                          */
  /* ================================================= */

  async createUser(data: {
    id: string;
    name: string;
    email: string;
    password: string;
    role: string;
    organizationId: string | null;
    designation?: string;
    isFirstLogin?: boolean;
  }) {
    const {
      id,
      name,
      email,
      password,
      role,
      organizationId,
      designation,
      isFirstLogin = false,
    } = data;

    await this.db.query(
      `
      INSERT INTO users (
        id,
        full_name,
        email,
        password,
        role,
        organization_id,
        designation,
        is_first_login,
        is_active,
        access_enabled
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,true,true)
      `,
      [
        id,
        name,
        email,
        password,
        role,
        organizationId,
        designation || null,
        isFirstLogin,
      ],
    );
  }

  /* ================================================= */
  /* ❌ DELETE USER                                    */
  /* ================================================= */

  async deleteById(userId: string, orgId?: string) {
    const res = await this.db.query(
      `
      DELETE FROM users
      WHERE id = $1
      ${orgId ? 'AND organization_id = $2' : ''}
      RETURNING id
      `,
      orgId ? [userId, orgId] : [userId],
    );

    if (!res.rows.length) {
      throw new NotFoundException('User not found or unauthorized');
    }

    return { message: 'User deleted' };
  }

  /* ================================================= */
  /* 🔁 TOGGLE ACCESS                                  */
  /* ================================================= */

  async toggleAccess(userId: string) {
    const res = await this.db.query(
      `
      UPDATE users
      SET access_enabled = NOT access_enabled
      WHERE id = $1
      RETURNING id, full_name, access_enabled
      `,
      [userId],
    );

    return res.rows[0];
  }

  /* ================================================= */
  /* 🔑 UPDATE PASSWORD                                */
  /* ================================================= */

  async updatePassword(userId: string, hashedPassword: string) {
    await this.db.query(
      `
      UPDATE users
      SET password = $1,
          is_first_login = false
      WHERE id = $2
      `,
      [hashedPassword, userId],
    );
  }
}

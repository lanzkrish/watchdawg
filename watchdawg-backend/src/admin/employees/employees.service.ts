/** @format */

import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { DatabaseService } from '../../database/database.service';
import { EmailService } from '../../email/email.service';

@Injectable()
export class EmployeesService {
  constructor(
    private readonly db: DatabaseService,
    private readonly emailService: EmailService,
  ) {}

  /* ================================================= */
  /* 🧠 HELPERS                                        */
  /* ================================================= */

  private async getOrganization(adminId: string) {
    const res = await this.db.query(
      `SELECT organization_id FROM users WHERE id = $1`,
      [adminId],
    );

    if (!res.rows[0]) {
      throw new NotFoundException('Admin not found');
    }

    return res.rows[0].organization_id;
  }

  private generateTempPassword() {
    return Math.random().toString(36).slice(-8);
  }

  private async generateEmployeeId(orgId: string) {
    const res = await this.db.query(
      `SELECT COUNT(*) FROM users WHERE organization_id = $1 AND role = 'employee'`,
      [orgId],
    );

    const number = String(Number(res.rows[0].count) + 1).padStart(3, '0');

    return `EMP-${number}`;
  }

  /* ================================================= */
  /* 📥 GET EMPLOYEES                                  */
  /* ================================================= */

  async getEmployees(adminId: string) {
    const orgId = await this.getOrganization(adminId);

    const result = await this.db.query(
      `
      SELECT
        id,
        full_name AS name,
        email,
        employee_id,
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

    return result.rows.map((r) => ({
      ...r,
      access_enabled: r.access_enabled ?? true,
      productivity: 0,
      status: 'Offline',
    }));
  }

  /* ================================================= */
  /* ➕ CREATE EMPLOYEE                                */
  /* ================================================= */

  async createEmployee(adminId: string, data: any) {
    const { name, email, designation } = data;

    if (!name || !email || !designation) {
      throw new BadRequestException('Name, email, and designation required');
    }

    /* 🔍 CHECK EMAIL */
    const existing = await this.db.query(
      `SELECT id FROM users WHERE email = $1`,
      [email],
    );

    if (existing.rows.length) {
      throw new BadRequestException('Email already exists');
    }

    const orgId = await this.getOrganization(adminId);

    /* 🆔 GENERATE EMPLOYEE ID */
    const employeeId = await this.generateEmployeeId(orgId);

    /* 🔐 PASSWORD */
    const tempPassword = this.generateTempPassword();
    const hashed = await bcrypt.hash(tempPassword, 10);

    const userId = uuid();

    /* 💾 INSERT */
    await this.db.query(
      `
      INSERT INTO users (
        id,
        full_name,
        email,
        password,
        role,
        designation,
        employee_id,
        is_active,
        access_enabled,
        is_first_login,
        organization_id
      )
      VALUES ($1,$2,$3,$4,'employee',$5,$6,true,true,true,$7)
      `,
      [userId, name, email, hashed, designation, employeeId, orgId],
    );

    /* 🔔 NOTIFICATION */
    await this.db.query(
      `
      INSERT INTO notifications (user_id, message, type)
      VALUES ($1, $2, 'account')
      `,
      [userId, 'Your account has been created'],
    );

    /* 📧 EMAIL (NON-BLOCKING) */
    this.emailService
      .sendEmployeeCredentials(email, name, employeeId, tempPassword)
      .catch((err) => {
        console.error('Email failed:', err.message);
      });

    return {
      message: 'Employee created successfully',
      employeeId,
    };
  }

  /* ================================================= */
  /* 🔁 TOGGLE ACCESS                                  */
  /* ================================================= */

  async toggleAccess(adminId: string, empId: string) {
    const orgId = await this.getOrganization(adminId);

    const user = await this.db.query(
      `SELECT access_enabled, organization_id FROM users WHERE id = $1`,
      [empId],
    );

    if (!user.rows[0]) {
      throw new NotFoundException('Employee not found');
    }

    if (user.rows[0].organization_id !== orgId) {
      throw new ForbiddenException('Not allowed');
    }

    const updated = await this.db.query(
      `
      UPDATE users
      SET access_enabled = NOT access_enabled
      WHERE id = $1
      RETURNING id, full_name, access_enabled
      `,
      [empId],
    );

    const access = updated.rows[0].access_enabled;

    await this.db.query(
      `
      INSERT INTO notifications (user_id, message, type)
      VALUES ($1, $2, 'system')
      `,
      [empId, access ? 'Access granted' : 'Access revoked'],
    );

    return updated.rows[0];
  }

  /* ================================================= */
  /* ❌ DELETE EMPLOYEE                                */
  /* ================================================= */

  async deleteEmployee(adminId: string, empId: string) {
    const orgId = await this.getOrganization(adminId);

    const res = await this.db.query(
      `
      DELETE FROM users
      WHERE id = $1 AND organization_id = $2
      RETURNING id
      `,
      [empId, orgId],
    );

    if (!res.rows.length) {
      throw new NotFoundException('Employee not found or unauthorized');
    }

    return { message: 'Employee removed successfully' };
  }

  /* ================================================= */
  /* 🧠 CREATE TASK + ASSIGN                           */
  /* ================================================= */

  async createTask(adminId: string, body: any) {
    const { title, description, priority, deadline, employeeIds } = body;

    if (!title || !employeeIds?.length) {
      throw new BadRequestException('Missing required fields');
    }

    const orgId = await this.getOrganization(adminId);

    const taskId = uuid();

    /* 🧠 CREATE TASK */
    await this.db.query(
      `
      INSERT INTO tasks (
        id,
        title,
        description,
        priority,
        status,
        deadline,
        created_by,
        organization_id
      )
      VALUES ($1,$2,$3,$4,'pending',$5,$6,$7)
      `,
      [taskId, title, description, priority, deadline, adminId, orgId],
    );

    /* 👥 ASSIGN */
    for (const empId of employeeIds) {
      await this.db.query(
        `
        INSERT INTO task_assignments (id, task_id, employee_id)
        VALUES ($1,$2,$3)
        `,
        [uuid(), taskId, empId],
      );

      await this.db.query(
        `
        INSERT INTO notifications (user_id, message, type)
        VALUES ($1, $2, 'task')
        `,
        [empId, `New task assigned: ${title}`],
      );
    }

    return {
      message: 'Task created and assigned successfully',
      taskId,
    };
  }
}

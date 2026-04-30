/** @format */

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { DatabaseService } from '../database/database.service';
import { EmailService } from '../email/email.service';

import { TaskPriority, TaskStatus } from '../common/enums/task.enum';

@Injectable()
export class TasksService {
  constructor(
    private readonly db: DatabaseService,
    private readonly emailService: EmailService, // ✅ inject
  ) {}

  /* ================================================= */
  /* 🧠 HELPERS                                        */
  /* ================================================= */

  private async getOrganizationId(userId: string): Promise<string> {
    const res = await this.db.query(
      `SELECT organization_id FROM users WHERE id = $1`,
      [userId],
    );

    if (!res.rows.length) {
      throw new NotFoundException('User not found');
    }

    return res.rows[0].organization_id;
  }

  /* ================================================= */
  /* ➕ CREATE TASK (FINAL + EMAIL SAFE)               */
  /* ================================================= */

  async createTask(adminId: string, body: any) {
    const { title, description, priority, deadline, employeeIds } = body;

    if (!title || !employeeIds?.length) {
      throw new BadRequestException('Missing required fields');
    }

    /* ✅ ENUM VALIDATION */
    if (!Object.values(TaskPriority).includes(priority)) {
      throw new BadRequestException('Invalid priority');
    }

    const orgId = await this.getOrganizationId(adminId);
    const taskId = uuid();

    // 🔥 store emails to send AFTER commit
    const emailQueue: any[] = [];

    try {
      await this.db.query('BEGIN');

      /* 🧠 CREATE TASK */
      await this.db.query(
        `
        INSERT INTO tasks (
          id,
          title,
          description,
          priority,
          deadline,
          status,
          progress,
          created_by,
          organization_id,
          created_at,
          updated_at
        )
        VALUES ($1,$2,$3,$4,$5,$6,0,$7,$8,NOW(),NOW())
        `,
        [
          taskId,
          title,
          description,
          priority,
          deadline,
          TaskStatus.TODO,
          adminId,
          orgId,
        ],
      );

      /* 👥 ASSIGN USERS */
      for (const empId of employeeIds) {
        await this.db.query(
          `
          INSERT INTO task_assignments (
            id,
            task_id,
            user_id,
            assigned_by,
            status,
            progress,
            assigned_at
          )
          VALUES ($1,$2,$3,$4,$5,0,NOW())
          `,
          [uuid(), taskId, empId, adminId, TaskStatus.TODO],
        );

        /* 🔔 NOTIFICATION */
        await this.db.query(
          `
          INSERT INTO notifications (user_id, message, type)
          VALUES ($1, $2, 'task')
          `,
          [empId, `New task assigned: ${title}`],
        );

        /* 📧 FETCH EMAIL (DO NOT SEND YET) */
        const user = await this.db.query(
          `SELECT email, full_name FROM users WHERE id = $1`,
          [empId],
        );

        if (user.rows[0]) {
          emailQueue.push({
            email: user.rows[0].email,
            name: user.rows[0].full_name,
          });
        }
      }

      await this.db.query('COMMIT');

      /* ================================================= */
      /* 📧 SEND EMAILS AFTER COMMIT (SAFE)                */
      /* ================================================= */

      for (const emp of emailQueue) {
        try {
          await this.emailService.sendTaskAssignmentEmail(
            emp.email,
            emp.name,
            title,
            description,
            deadline,
            priority,
          );
        } catch (err) {
          console.error('Email failed for:', emp.email);
        }
      }

      return {
        message: 'Task created and assigned successfully',
        taskId,
      };
    } catch (err) {
      await this.db.query('ROLLBACK');
      throw err;
    }
  }

  /* ================================================= */
  /* 📥 GET ALL TASKS                                  */
  /* ================================================= */

  async getAllTasks(adminId: string) {
    const orgId = await this.getOrganizationId(adminId);

    const res = await this.db.query(
      `
      SELECT
        t.*,
        COALESCE(
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'userId', u.id,
              'name', u.full_name,
              'status', ta.status,
              'progress', ta.progress
            )
          ) FILTER (WHERE u.id IS NOT NULL),
          '[]'
        ) AS assignees
      FROM tasks t
      LEFT JOIN task_assignments ta ON ta.task_id = t.id
      LEFT JOIN users u ON u.id = ta.user_id
      WHERE t.organization_id = $1
      GROUP BY t.id
      ORDER BY t.created_at DESC
      `,
      [orgId],
    );

    return res.rows;
  }

  /* ================================================= */
  /* 📥 GET TASKS FOR EMPLOYEE                         */
  /* ================================================= */

  async getEmployeeTasks(userId: string) {
    const res = await this.db.query(
      `
      SELECT
        t.*,
        ta.status AS my_status,
        ta.progress AS my_progress,
        ta.assigned_at,
        ta.started_at,
        ta.completed_at
      FROM tasks t
      JOIN task_assignments ta ON ta.task_id = t.id
      WHERE ta.user_id = $1
      ORDER BY t.created_at DESC
      `,
      [userId],
    );

    return res.rows;
  }

  /* ================================================= */
  /* 🔄 UPDATE TASK STATUS                             */
  /* ================================================= */

  async updateTaskStatus(taskId: string, userId: string, status: string) {
    if (!Object.values(TaskStatus).includes(status as TaskStatus)) {
      throw new BadRequestException('Invalid status');
    }

    const check = await this.db.query(
      `
      SELECT id FROM task_assignments
      WHERE task_id = $1 AND user_id = $2
      `,
      [taskId, userId],
    );

    if (!check.rows.length) {
      throw new BadRequestException('Not authorized for this task');
    }

    const res = await this.db.query(
      `
      UPDATE task_assignments
      SET status = $1,
          started_at = CASE WHEN $1 = 'in_progress' THEN NOW() ELSE started_at END,
          completed_at = CASE WHEN $1 = 'completed' THEN NOW() ELSE NULL END
      WHERE task_id = $2 AND user_id = $3
      RETURNING *
      `,
      [status, taskId, userId],
    );

    return res.rows[0];
  }

  /* ================================================= */
  /* ❌ DELETE TASK                                    */
  /* ================================================= */

  async deleteTask(taskId: string, adminId: string) {
    const orgId = await this.getOrganizationId(adminId);

    const res = await this.db.query(
      `
      DELETE FROM tasks
      WHERE id = $1 AND organization_id = $2
      RETURNING id
      `,
      [taskId, orgId],
    );

    if (!res.rows.length) {
      throw new NotFoundException('Task not found');
    }

    return { message: 'Task deleted successfully' };
  }
}

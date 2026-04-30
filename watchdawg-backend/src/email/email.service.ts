/** @format */

import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as nodemailer from 'nodemailer';
import * as path from 'path';

@Injectable()
export class EmailService {
  private readonly transporter: nodemailer.Transporter;
  private readonly logger = new Logger(EmailService.name);

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.zoho.in',
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  /* ================================================= */
  /* 📧 GENERIC EMAIL                                 */
  /* ================================================= */

  async sendMail(to: string, subject: string, html: string) {
    try {
      const info = await this.transporter.sendMail({
        from: `"WorkSync" <${process.env.EMAIL_FROM}>`,
        to,
        subject,
        html,
      });

      this.logger.log(`📧 Email sent → ${to}`);

      return {
        messageId: info.messageId,
        response: info.response,
      };
    } catch (error: any) {
      this.logger.error('❌ Email failed', error?.message || error);
      throw new Error('Email sending failed');
    }
  }

  /* ================================================= */
  /* 🧠 LOAD TEMPLATE (DEV + PROD SAFE)               */
  /* ================================================= */

  private loadTemplate(
    filename: string,
    replacements: Record<string, string>,
  ): string {
    const possiblePaths = [
      path.join(process.cwd(), 'dist', 'email', 'templates', filename),
      path.join(process.cwd(), 'src', 'email', 'templates', filename),
    ];

    const filePath = possiblePaths.find((p) => fs.existsSync(p));

    if (!filePath) {
      this.logger.error(`Template not found: ${filename}`);
      throw new Error('Email template missing');
    }

    let html = fs.readFileSync(filePath, 'utf-8');

    for (const key in replacements) {
      html = html.replace(
        new RegExp(`{{${key}}}`, 'g'),
        replacements[key] ?? '',
      );
    }

    return html;
  }

  /* ================================================= */
  /* 👤 EMPLOYEE CREDENTIALS EMAIL                    */
  /* ================================================= */

  async sendEmployeeCredentials(
    email: string,
    name: string,
    employeeId: string,
    password: string,
  ) {
    const html = this.loadTemplate('employee-credentials.html', {
      name,
      employeeId,
      password,
    });

    return this.sendMail(email, 'Welcome to WorkSync 🚀', html);
  }

  /* ================================================= */
  /* 📋 TASK ASSIGNMENT EMAIL (FINAL VERSION)          */
  /* ================================================= */

  async sendTaskAssignmentEmail(
    email: string,
    name: string,
    title: string,
    description?: string,
    deadline?: string,
    priority?: string,
  ) {
    const formattedDeadline = deadline
      ? new Date(deadline).toLocaleString('en-IN', {
          dateStyle: 'medium',
          timeStyle: 'short',
        })
      : 'No deadline';

    const html = this.loadTemplate('task-assigned.html', {
      name,
      title,
      description: description || 'No description',
      deadline: formattedDeadline,
      priority: priority || 'normal',
    });

    return this.sendMail(email, '📋 New Task Assigned', html);
  }
}

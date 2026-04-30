/** @format */

import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';

@Injectable()
export class SystemService {
  constructor(private db: DatabaseService) {}

  async getSystemData() {
    const [tickets, issues, logs] = await Promise.all([
      this.getTickets(),
      this.getIssues(),
      this.getLogs(),
    ]);

    return {
      tickets,
      issues,
      logs,
    };
  }

  /* ======================================= */
  /* 🎫 SUPPORT TICKETS                     */
  /* ======================================= */

  private async getTickets() {
    return [
      {
        id: 1,
        title: 'Login issue',
        status: 'open',
        createdAt: new Date(),
      },
      {
        id: 2,
        title: 'Payment failed',
        status: 'resolved',
        createdAt: new Date(),
      },
    ];
  }

  /* ======================================= */
  /* ⚠️ SYSTEM ISSUES                       */
  /* ======================================= */

  private async getIssues() {
    return [
      {
        id: 1,
        type: 'slow',
        message: 'Dashboard loading slow',
        status: 'open',
        time: new Date(),
      },
      {
        id: 2,
        type: 'error',
        message: 'API timeout error',
        status: 'resolved',
        time: new Date(),
      },
    ];
  }

  /* ======================================= */
  /* 📜 SYSTEM LOGS                         */
  /* ======================================= */

  private async getLogs() {
    return [
      {
        id: 1,
        message: 'User logged in',
        level: 'info',
        time: new Date(),
      },
      {
        id: 2,
        message: 'Database connection slow',
        level: 'warning',
        time: new Date(),
      },
      {
        id: 3,
        message: 'Server restarted',
        level: 'success',
        time: new Date(),
      },
    ];
  }
}

/** @format */

import { Controller, Get, Logger, Req, UseGuards } from '@nestjs/common';

import { Roles } from '../../common/decorators/roles.decorator';
import { JwtGuard } from '../../common/guards/jwt/jwt.guard';
import { RolesGuard } from '../../common/guards/roles/roles.guard';
import { AdminDashboardService } from './dashboard.service';

@Controller('admin/dashboard')
@UseGuards(JwtGuard, RolesGuard)
export class AdminDashboardController {
  private readonly logger = new Logger(AdminDashboardController.name);

  constructor(private service: AdminDashboardService) {}

  @Get()
  @Roles('admin')
  async getDashboard(@Req() req: any) {
    try {
      /* ============================== */
      /* 🔍 DEBUG USER                  */
      /* ============================== */

      this.logger.log(`📡 Dashboard request from user: ${req.user?.userId}`);

      if (!req.user?.userId) {
        this.logger.warn('❌ Missing userId in request');

        return {
          success: false,
          message: 'Unauthorized',
          stats: null,
          productivityTrend: [],
          employeeActivity: [],
        };
      }

      /* ============================== */
      /* 🚀 FETCH DATA                  */
      /* ============================== */

      const data = await this.service.getDashboard(req.user.userId);

      this.logger.log('✅ Dashboard data fetched');

      return {
        success: true,
        ...data,
      };
    } catch (err: unknown) {
      let message = 'Unknown error';

      if (err instanceof Error) {
        message = err.stack || err.message;
      }

      this.logger.error('❌ Dashboard API Error', message);

      return {
        success: false,
        message: 'Failed to load dashboard',
        stats: null,
        productivityTrend: [],
        employeeActivity: [],
      };
    }
  }
}

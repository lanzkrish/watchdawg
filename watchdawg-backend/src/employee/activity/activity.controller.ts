/** @format */

import { Controller, Get, Logger, Req, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../../common/guards/jwt/jwt.guard';
import { EmployeeActivityService } from './activity.service';

/* ============================== */
/* 🧠 TYPE SAFETY                 */
/* ============================== */

interface AuthRequest extends Request {
  user: {
    userId: string;
  };
}

@Controller('employee/activity')
@UseGuards(JwtGuard)
export class EmployeeActivityController {
  private readonly logger = new Logger(EmployeeActivityController.name);

  constructor(private readonly service: EmployeeActivityService) {}

  /* ============================== */
  /* 📊 GET USER ACTIVITY           */
  /* ============================== */

  @Get()
  async getMyActivity(@Req() req: AuthRequest) {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        this.logger.warn('⚠️ Missing userId in request');
        return {
          success: false,
          message: 'Unauthorized',
          data: [],
        };
      }

      const data = await this.service.getMyActivity(userId);

      return {
        success: true,
        count: data.length,
        data,
      };
    } catch (error) {
      this.logger.error('❌ Failed to fetch activity', error);

      return {
        success: false,
        message: 'Failed to fetch activity',
        data: [],
      };
    }
  }
}

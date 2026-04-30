/** @format */

import {
  Controller,
  Get,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';

import { JwtGuard } from '../../common/guards/jwt/jwt.guard';
import { EmployeeDashboardService } from './dashboard.service';

@Controller('employee/dashboard')
@UseGuards(JwtGuard)
export class EmployeeDashboardController {
  constructor(private readonly service: EmployeeDashboardService) {}

  @Get()
  async getDashboard(@Req() req: any) {
    try {
      /* ============================== */
      /* 🔐 SAFE USER EXTRACTION        */
      /* ============================== */

      const user = req.user;

      if (!user) {
        throw new UnauthorizedException('User not found in request');
      }

      // 🔥 SUPPORT MULTIPLE JWT FORMATS
      const userId = user.userId || user.id || user.sub;

      if (!userId) {
        throw new UnauthorizedException('Invalid token payload');
      }

      console.log('👤 Dashboard request for:', userId);

      /* ============================== */
      /* 🚀 SERVICE CALL               */
      /* ============================== */

      return await this.service.getDashboard(userId);
    } catch (err) {
      console.error('❌ Dashboard Controller Error:', err);
      throw err;
    }
  }
}

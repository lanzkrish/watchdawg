/** @format */

import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtGuard } from 'src/common/guards/jwt/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles/roles.guard';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
@UseGuards(JwtGuard, RolesGuard)
export class DashboardController {
  constructor(private dashboard: DashboardService) {}

  /* ================================================= */
  /* 👑 ADMIN DASHBOARD                                */
  /* ================================================= */

  @Get('admin')
  @Roles('admin')
  getAdminDashboard(@Req() req: any) {
    return this.dashboard.getAdminDashboard(req.user.userId);
  }

  /* ================================================= */
  /* 👨‍💻 EMPLOYEE DASHBOARD                           */
  /* ================================================= */

  @Get('employee')
  @Roles('employee')
  getEmployeeDashboard(@Req() req: any) {
    return this.dashboard.getEmployeeDashboard(req.user.userId);
  }
}

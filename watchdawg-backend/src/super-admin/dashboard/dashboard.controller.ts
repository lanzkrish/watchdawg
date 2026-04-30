/** @format */

import { Controller, Get, UseGuards } from '@nestjs/common';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtGuard } from '../../common/guards/jwt/jwt.guard';
import { RolesGuard } from '../../common/guards/roles/roles.guard';
import { DashboardService } from './dashboard.service';

@Controller('super-admin/dashboard')
@UseGuards(JwtGuard, RolesGuard)
export class DashboardController {
  constructor(private dashboard: DashboardService) {}

  @Get()
  @Roles('superadmin')
  getDashboard() {
    return this.dashboard.getDashboardData();
  }
}

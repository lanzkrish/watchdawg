/** @format */

import { Controller, Get, UseGuards } from '@nestjs/common';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtGuard } from '../../common/guards/jwt/jwt.guard';
import { RolesGuard } from '../../common/guards/roles/roles.guard';
import { RevenueService } from './revenue.service';

@Controller('super-admin/revenue')
@UseGuards(JwtGuard, RolesGuard)
export class RevenueController {
  constructor(private revenue: RevenueService) {}

  @Get()
  @Roles('superadmin')
  getRevenue() {
    return this.revenue.getRevenueData();
  }
}

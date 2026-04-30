/** @format */

import { Controller, Get, Param, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtGuard } from '../../common/guards/jwt/jwt.guard';
import { RolesGuard } from '../../common/guards/roles/roles.guard';
import { AdminReportsService } from './reports.service';

@Controller('admin/reports')
@UseGuards(JwtGuard, RolesGuard)
@Roles('admin')
export class AdminReportsController {
  constructor(private readonly reportsService: AdminReportsService) {}

  /* 📥 GET REPORT LIST */
  @Get()
  getReports() {
    return this.reportsService.getReports();
  }

  /* 📄 DOWNLOAD REPORT */
  @Get(':id/download')
  async downloadReport(@Param('id') id: string, @Res() res: Response) {
    const file = await this.reportsService.generateReport(id);

    res.setHeader('Content-Disposition', `attachment; filename=${file.name}`);
    res.setHeader('Content-Type', 'application/json');

    res.send(file.data);
  }
}

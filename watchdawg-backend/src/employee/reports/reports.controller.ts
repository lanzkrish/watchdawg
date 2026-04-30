/** @format */

import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { JwtGuard } from '../../common/guards/jwt/jwt.guard';
import { EmployeeReportsService } from './reports.service';

@Controller('employee/reports')
@UseGuards(JwtGuard)
export class EmployeeReportsController {
  constructor(private service: EmployeeReportsService) {}

  /* ================================================= */
  /* 🚀 OVERVIEW (MAIN DASHBOARD DATA)                 */
  /* ================================================= */

  @Get('overview')
  async getOverview(@Req() req: any) {
    return this.service.getOverview(req.user.userId);
  }

  /* ================================================= */
  /* 📊 GET REPORTS (LIST VIEW)                        */
  /* ================================================= */

  @Get()
  async getReports(@Req() req: any) {
    return this.service.getMyReports(req.user.userId);
  }

  /* ================================================= */
  /* ⬇️ DOWNLOAD REPORT (CSV FILE)                     */
  /* ================================================= */

  @Get(':date') // 🔥 CLEAN ROUTE (recommended)
  async download(
    @Param('date') date: string,
    @Req() req: any,
    @Res() res: Response,
  ) {
    const userId = req.user.userId;

    /* ============================== */
    /* 🔒 VALIDATE DATE FORMAT        */
    /* ============================== */

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      throw new BadRequestException(
        'Invalid date format (YYYY-MM-DD required)',
      );
    }

    const file = await this.service.downloadReport(date, userId);

    /* ============================== */
    /* 📥 HEADERS (PRODUCTION SAFE)   */
    /* ============================== */

    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${file.filename}"`,
    );

    res.setHeader('Content-Type', 'text/csv');

    // 🔥 prevent caching issues
    res.setHeader('Cache-Control', 'no-store');

    res.send(file.content);
  }
}

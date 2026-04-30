/** @format */

import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtGuard } from '../../common/guards/jwt/jwt.guard';
import { RolesGuard } from '../../common/guards/roles/roles.guard';
import { AdminSettingsService } from './settings.service';

@Controller('admin/settings')
@UseGuards(JwtGuard, RolesGuard)
@Roles('admin')
export class AdminSettingsController {
  constructor(private readonly service: AdminSettingsService) {}

  /* 📥 GET SETTINGS */
  @Get()
  getSettings(@Req() req: any) {
    const orgId = req.user.organizationId;
    return this.service.getSettings(orgId);
  }

  /* ✏️ UPDATE SETTINGS */
  @Patch()
  updateSettings(@Req() req: any, @Body() body: any) {
    const orgId = req.user.organizationId;
    return this.service.updateSettings(orgId, body);
  }
}

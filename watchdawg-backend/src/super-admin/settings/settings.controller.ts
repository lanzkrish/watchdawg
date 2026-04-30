/** @format */

import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtGuard } from '../../common/guards/jwt/jwt.guard';
import { RolesGuard } from '../../common/guards/roles/roles.guard';
import { SettingsService } from './settings.service';

@Controller('super-admin/settings')
@UseGuards(JwtGuard, RolesGuard)
export class SettingsController {
  constructor(private settings: SettingsService) {}

  @Get()
  @Roles('superadmin')
  getSettings() {
    return this.settings.getAllSettings();
  }

  @Patch()
  @Roles('superadmin')
  updateSettings(@Body() body: any) {
    return this.settings.updateSettings(body);
  }
}

/** @format */

import { Controller, Get, UseGuards } from '@nestjs/common';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtGuard } from '../../common/guards/jwt/jwt.guard';
import { RolesGuard } from '../../common/guards/roles/roles.guard';
import { SystemService } from './system.service';

@Controller('super-admin/system')
@UseGuards(JwtGuard, RolesGuard)
export class SystemController {
  constructor(private service: SystemService) {}

  @Get()
  @Roles('superadmin')
  getSystem() {
    return this.service.getSystemData();
  }
}

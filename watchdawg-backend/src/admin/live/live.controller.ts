/** @format */

import { Controller, Get, UseGuards } from '@nestjs/common';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtGuard } from '../../common/guards/jwt/jwt.guard';
import { RolesGuard } from '../../common/guards/roles/roles.guard';
import { LiveService } from './live.service';

@Controller('admin/live')
@UseGuards(JwtGuard, RolesGuard)
export class LiveController {
  constructor(private readonly liveService: LiveService) {}

  @Get()
  @Roles('admin')
  getLiveData() {
    return this.liveService.getLiveData();
  }
}

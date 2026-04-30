/** @format */

import { Controller, Get, UseGuards } from '@nestjs/common';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtGuard } from '../../common/guards/jwt/jwt.guard';
import { RolesGuard } from '../../common/guards/roles/roles.guard';
import { OrganizationsService } from './organizations.service';

@Controller('super-admin/organizations')
@UseGuards(JwtGuard, RolesGuard)
export class OrganizationsController {
  constructor(private service: OrganizationsService) {}

  @Get()
  @Roles('superadmin')
  getAll() {
    return this.service.getAllOrganizations();
  }
}

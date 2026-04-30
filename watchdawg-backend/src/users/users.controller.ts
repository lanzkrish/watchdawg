/** @format */

import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';

import { UsersService } from './users.service';

import { JwtGuard } from '../common/guards/jwt/jwt.guard';

@Controller('users')
@UseGuards(JwtGuard)
export class UsersController {
  constructor(private readonly users: UsersService) {}

  /* ================================================= */
  /* 🔍 GET CURRENT USER (PROFILE)                     */
  /* ================================================= */

  @Get('me')
  getCurrentUser(@Req() req: Request) {
    const userId = (req as any).user.id;
    return this.users.findById(userId);
  }

  /* ================================================= */
  /* 🔍 GET USER BY ID                                 */
  /* ================================================= */

  @Get(':id')
  getUserById(@Param('id') id: string) {
    return this.users.findById(id);
  }
}

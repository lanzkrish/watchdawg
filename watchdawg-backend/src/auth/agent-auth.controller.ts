/** @format */

import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Request } from 'express';

import { JwtGuard } from '../common/guards/jwt/jwt.guard';

import { AgentAuthService } from './agent-auth.service';
import { AgentChangePasswordDto } from './agent-dto/agent-change-password.dto';
import { AgentForgotPasswordDto } from './agent-dto/agent-forgot-password.dto';
import { AgentLoginDto } from './agent-dto/agent-login.dto';

@Controller('agent/auth')
@UsePipes(new ValidationPipe({ whitelist: true }))
export class AgentAuthController {
  constructor(private readonly auth: AgentAuthService) {}

  /* ================= LOGIN ================= */

  @Post('login')
  login(@Body() body: AgentLoginDto) {
    return this.auth.agentLogin(body.email, body.password);
  }

  /* ================= CHANGE PASSWORD ================= */

  @Post('change-password')
  @UseGuards(JwtGuard)
  changePassword(
    @Req() req: Request & { user: any },
    @Body() body: AgentChangePasswordDto,
  ) {
    return this.auth.changePassword(
      req.user.id,
      body.oldPassword,
      body.newPassword,
    );
  }

  /* ================= FORGOT PASSWORD ================= */

  @Post('forgot-password')
  forgotPassword(@Body() body: AgentForgotPasswordDto) {
    return this.auth.forgotPassword(body.email);
  }
}


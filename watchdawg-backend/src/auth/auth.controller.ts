/** @format */

import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { AuthService } from './auth.service';

import { LoginDto } from './dto/login.dto';
import { RegisterAdminDto } from './dto/register-admin.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('auth')
@UsePipes(new ValidationPipe({ whitelist: true }))
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  /* ================================================= */
  /* 🏢 REGISTER ADMIN                                 */
  /* ================================================= */

  @Post('register-admin')
  registerAdmin(@Body() body: RegisterAdminDto) {
    return this.auth.registerAdmin(body);
  }

  /* ================================================= */
  /* 🔐 WEBSITE LOGIN                                  */
  /* ================================================= */

  @Post('login')
  login(@Body() body: LoginDto) {
    return this.auth.login(body.email, body.password);
  }

  /* ================================================= */
  /* 🔄 RESET PASSWORD (ADMIN / SYSTEM)                */
  /* ================================================= */

  @Post('reset-password')
  resetPassword(@Body() body: ResetPasswordDto) {
    return this.auth.resetPassword(body.userId, body.newPassword);
  }
}

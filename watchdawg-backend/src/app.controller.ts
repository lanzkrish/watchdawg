/** @format */

import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../src/common/guards/jwt/jwt.guard';
import { AppService } from './app.service';

@Controller('app')
@UseGuards(JwtGuard)
export class AppController {
  constructor(private app: AppService) {}

  @Post('usage')
  trackApp(@Req() req: any, @Body() body: any) {
    return this.app.track(req.user.userId, body);
  }
}

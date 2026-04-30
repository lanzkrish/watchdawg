// /** @format */

// import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
// import { JwtGuard } from '../common/guards/jwt/jwt.guard';
// import { ActivityService } from './activity.service';
// import { ActivityDto } from './dto/activity.dto';

// @Controller('activity')
// @UseGuards(JwtGuard)
// export class ActivityController {
//   constructor(private activity: ActivityService) {}

//   @Post('track')
//   track(@Req() req, @Body() body: ActivityDto) {
//     return this.activity.track(req.user.userId, body);
//   }

//   @Post('heartbeat')
//   @UseGuards(JwtGuard)
//   heartbeat(@Req() req: any) {
//     return this.activity.heartbeat(req.user.userId);
//   }
// }

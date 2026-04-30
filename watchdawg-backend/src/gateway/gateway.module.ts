/** @format */

import { Module } from '@nestjs/common';

import { ActivityGateway } from './activity.gateway';

import { UsersModule } from 'src/users/users.module';
import { UnifiedGateway } from './unified.gateway';

@Module({
  imports: [UsersModule],

  providers: [ActivityGateway, UnifiedGateway],

  exports: [UnifiedGateway],
})
export class GatewayModule {}

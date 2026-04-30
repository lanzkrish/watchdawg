import { Module } from '@nestjs/common';
import { GatewayModule } from '../gateway/gateway.module'; // ✅ ADD
import { TrackingController } from './tracking.controller';
import { TrackingService } from './tracking.service';

@Module({
  imports: [GatewayModule], // ✅ IMPORTANT
  controllers: [TrackingController],
  providers: [TrackingService],
})
export class TrackingModule {}

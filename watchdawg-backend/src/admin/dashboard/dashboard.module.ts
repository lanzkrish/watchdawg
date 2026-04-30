import { Module } from '@nestjs/common';

import { DatabaseModule } from 'src/database/database.module';
import { AdminDashboardController } from './dashboard.controller';
import { AdminDashboardService } from './dashboard.service';

@Module({
  imports: [DatabaseModule],
  controllers: [AdminDashboardController],
  providers: [AdminDashboardService],
})
export class AdminDashboardModule {}

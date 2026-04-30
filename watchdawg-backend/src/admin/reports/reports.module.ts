/** @format */

import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { AdminReportsController } from './reports.controller';
import { AdminReportsService } from './reports.service';

@Module({
  imports: [DatabaseModule],
  controllers: [AdminReportsController],
  providers: [AdminReportsService],
})
export class AdminReportsModule {}

/** @format */

import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { EmployeeDashboardController } from './dashboard.controller';
import { EmployeeDashboardService } from './dashboard.service';

@Module({
  imports: [DatabaseModule],
  controllers: [EmployeeDashboardController],
  providers: [EmployeeDashboardService],
})
export class EmployeeDashboardModule {}

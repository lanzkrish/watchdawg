/** @format */

import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { EmployeeReportsController } from './reports.controller';
import { EmployeeReportsService } from './reports.service';

@Module({
  imports: [DatabaseModule],
  controllers: [EmployeeReportsController],
  providers: [EmployeeReportsService],
})
export class EmployeeReportsModule {}

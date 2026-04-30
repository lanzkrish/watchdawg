/** @format */

import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { EmployeeActivityController } from './activity.controller';
import { EmployeeActivityService } from './activity.service';

@Module({
  imports: [DatabaseModule],
  controllers: [EmployeeActivityController],
  providers: [EmployeeActivityService],
})
export class EmployeeActivityModule {}

/** @format */

import { Module } from '@nestjs/common';
import { EmailModule } from 'src/email/email.module';
import { DatabaseModule } from '../../database/database.module';
import { EmployeesController } from './employees.controller';
import { EmployeesService } from './employees.service';

@Module({
  imports: [DatabaseModule, EmailModule],
  controllers: [EmployeesController],
  providers: [EmployeesService],
})
export class EmployeesModule {}

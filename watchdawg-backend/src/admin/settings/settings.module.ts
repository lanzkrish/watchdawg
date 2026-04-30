/** @format */

import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { AdminSettingsController } from './settings.controller';
import { AdminSettingsService } from './settings.service';

@Module({
  imports: [DatabaseModule],
  controllers: [AdminSettingsController],
  providers: [AdminSettingsService],
})
export class AdminSettingsModule {}

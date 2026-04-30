/** @format */

import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { LiveController } from './live.controller';
import { LiveService } from './live.service';

@Module({
  imports: [DatabaseModule],
  controllers: [LiveController],
  providers: [LiveService],
})
export class LiveModule {}

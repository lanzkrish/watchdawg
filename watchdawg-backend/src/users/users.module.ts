/** @format */

import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [DatabaseModule],
  controllers: [UsersController],
  providers: [UsersService],

  // 🔥 THIS IS THE FIX
  exports: [UsersService],
})
export class UsersModule {}

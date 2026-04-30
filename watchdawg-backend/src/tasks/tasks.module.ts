import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { EmailModule } from '../email/email.module'; // ✅ ADD THIS
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

@Module({
  imports: [
    DatabaseModule,
    EmailModule, // 🔥 IMPORTANT
  ],
  providers: [TasksService],
  controllers: [TasksController],
})
export class TasksModule {}

/** @format */

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import type { Request } from 'express';

import { TasksService } from './tasks.service';

import { Roles } from '../common/decorators/roles.decorator';
import { JwtGuard } from '../common/guards/jwt/jwt.guard';
import { RolesGuard } from '../common/guards/roles/roles.guard';

import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';

/* ✅ OPTIONAL: Strong typing for user */
interface AuthUser {
  id: string;
  role: string;
  organizationId: string;
}

@Controller('tasks')
@UseGuards(JwtGuard, RolesGuard)
@UsePipes(new ValidationPipe({ whitelist: true }))
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  /* ================================================= */
  /* 🧠 HELPER: GET AUTH USER                          */
  /* ================================================= */

  private getUser(req: Request): AuthUser {
    return (req as any).user;
  }

  /* ================================================= */
  /* 👑 ADMIN: CREATE TASK                             */
  /* ================================================= */

  @Post()
  @Roles('admin')
  async createTask(@Req() req: Request, @Body() body: CreateTaskDto) {
    const user = this.getUser(req);

    return this.tasksService.createTask(user.id, body);
  }

  /* ================================================= */
  /* 👑 ADMIN: GET ALL TASKS                           */
  /* ================================================= */

  @Get()
  @Roles('admin')
  async getAllTasks(@Req() req: Request) {
    const user = this.getUser(req);

    return this.tasksService.getAllTasks(user.id);
  }

  /* ================================================= */
  /* 👤 EMPLOYEE: GET MY TASKS                         */
  /* ================================================= */

  @Get('my')
  @Roles('employee')
  async getMyTasks(@Req() req: Request) {
    const user = this.getUser(req);

    return this.tasksService.getEmployeeTasks(user.id);
  }

  /* ================================================= */
  /* 👤 EMPLOYEE: UPDATE TASK STATUS                   */
  /* ================================================= */

  @Patch(':id/status')
  @Roles('employee')
  async updateTaskStatus(
    @Req() req: Request,
    @Param('id') taskId: string,
    @Body() body: UpdateTaskStatusDto,
  ) {
    const user = this.getUser(req);

    return this.tasksService.updateTaskStatus(taskId, user.id, body.status);
  }

  /* ================================================= */
  /* 👑 ADMIN: DELETE TASK                             */
  /* ================================================= */

  @Delete(':id')
  @Roles('admin')
  async deleteTask(@Req() req: Request, @Param('id') taskId: string) {
    const user = this.getUser(req);

    return this.tasksService.deleteTask(taskId, user.id);
  }
}

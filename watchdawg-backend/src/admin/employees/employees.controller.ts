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

import { Roles } from '../../common/decorators/roles.decorator';
import { JwtGuard } from '../../common/guards/jwt/jwt.guard';
import { RolesGuard } from '../../common/guards/roles/roles.guard';

import { CreateTaskDto } from '../../tasks/dto/create-task.dto';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { EmployeesService } from './employees.service';

@Controller('admin/employees')
@UseGuards(JwtGuard, RolesGuard)
@Roles('admin')
export class EmployeesController {
  constructor(private readonly service: EmployeesService) {}

  /* ================================================= */
  /* 📥 GET ALL EMPLOYEES                              */
  /* ================================================= */

  @Get()
  async getEmployees(@Req() req: Request) {
    const adminId = (req as any).user.id;
    return this.service.getEmployees(adminId);
  }

  /* ================================================= */
  /* ➕ CREATE EMPLOYEE                                */
  /* ================================================= */

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async createEmployee(@Req() req: Request, @Body() body: CreateEmployeeDto) {
    const adminId = (req as any).user.id;
    return this.service.createEmployee(adminId, body);
  }

  /* ================================================= */
  /* 🔁 TOGGLE ACCESS                                  */
  /* ================================================= */

  @Patch(':id/access')
  async toggleAccess(@Req() req: Request, @Param('id') id: string) {
    const adminId = (req as any).user.id;
    return this.service.toggleAccess(adminId, id);
  }

  /* ================================================= */
  /* ❌ DELETE EMPLOYEE                                */
  /* ================================================= */

  @Delete(':id')
  async deleteEmployee(@Req() req: Request, @Param('id') id: string) {
    const adminId = (req as any).user.id;
    return this.service.deleteEmployee(adminId, id);
  }

  /* ================================================= */
  /* 🧠 CREATE TASK + ASSIGN                           */
  /* ================================================= */

  @Post('tasks')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async createTask(@Req() req: Request, @Body() body: CreateTaskDto) {
    const adminId = (req as any).user.id;
    return this.service.createTask(adminId, body);
  }
}

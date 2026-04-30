/** @format */

import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

import { TaskPriority } from '../../common/enums/task.enum';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(TaskPriority)
  priority!: TaskPriority;

  @IsOptional()
  @IsISO8601()
  deadline?: string;

  @IsArray()
  @ArrayNotEmpty()
  employeeIds!: string[];
}

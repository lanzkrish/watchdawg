/** @format */

import { IsEmail, IsOptional, IsString } from 'class-validator';

export class SendTaskDto {
  @IsEmail()
  email!: string;

  @IsString()
  name!: string;

  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  priority?: string;

  @IsOptional()
  @IsString()
  deadline?: string;
}

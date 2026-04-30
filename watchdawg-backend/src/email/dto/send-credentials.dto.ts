/** @format */

import { IsEmail, IsString, MinLength } from 'class-validator';

export class SendCredentialsDto {
  @IsEmail()
  email!: string;

  @IsString()
  name!: string;

  @IsString()
  employeeId!: string; // 🔥 REQUIRED

  @IsString()
  @MinLength(6)
  password!: string;
}

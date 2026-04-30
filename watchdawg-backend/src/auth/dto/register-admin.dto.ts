/** @format */

import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterAdminDto {
  @IsNotEmpty()
  fullName!: string;

  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @MinLength(6)
  password!: string;

  @IsNotEmpty()
  companyName!: string;

  @IsNotEmpty()
  industry!: string;

  @IsNotEmpty()
  size!: string;
}

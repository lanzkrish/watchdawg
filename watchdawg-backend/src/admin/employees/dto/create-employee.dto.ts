/** @format */

import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateEmployeeDto {
  @IsNotEmpty()
  name!: string;

  @IsEmail()
  email!: string;

  @IsNotEmpty()
  designation!: string;

  // optional later if you allow custom roles
  // @IsOptional()
  // role?: 'employee';
}

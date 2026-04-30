/** @format */

import { IsNotEmpty, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsNotEmpty()
  userId!: string;

  @IsNotEmpty()
  @MinLength(6)
  newPassword!: string;
}

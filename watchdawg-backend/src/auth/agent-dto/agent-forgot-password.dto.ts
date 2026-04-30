/** @format */

import { IsEmail } from 'class-validator';

export class AgentForgotPasswordDto {
  @IsEmail()
  email!: string;
}

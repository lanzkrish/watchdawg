/** @format */

import { IsBoolean, IsNumber } from 'class-validator';

export class ActivityDto {
  @IsBoolean()
  isActive!: boolean;

  @IsNumber()
  productivityScore!: number;

  @IsNumber()
  duration!: number;
}

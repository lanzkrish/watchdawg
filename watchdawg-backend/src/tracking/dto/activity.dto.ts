/** @format */

import { Type } from 'class-transformer';
import {
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

/* ============================== */
/* 🎵 BACKGROUND DTO              */
/* ============================== */

export class BackgroundDto {
  @IsString()
  app!: string;

  @IsOptional()
  @IsIn(['music'])
  type?: 'music';

  @Type(() => Number) // ✅ FIX
  @IsNumber()
  duration!: number;
}

/* ============================== */
/* 📦 ACTIVITY DTO                */
/* ============================== */

export class ActivityDto {
  @IsString()
  userId!: string;

  @IsString()
  organizationId!: string;

  @IsString()
  app!: string;

  @Type(() => Number) // ✅ FIX
  @IsNumber()
  duration!: number;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  platform?: string;

  @IsOptional()
  @IsString()
  domain?: string;

  @IsOptional()
  @IsIn(['productive', 'neutral', 'distracting'])
  category?: 'productive' | 'neutral' | 'distracting';

  @IsOptional()
  @IsIn(['active', 'idle', 'away'])
  status?: 'active' | 'idle' | 'away';

  @IsOptional()
  @Type(() => Number) // ✅ FIX
  @IsNumber()
  timestamp?: number;

  /* 🔥 NESTED VALIDATION */
  @IsOptional()
  @ValidateNested()
  @Type(() => BackgroundDto)
  background?: BackgroundDto;
}

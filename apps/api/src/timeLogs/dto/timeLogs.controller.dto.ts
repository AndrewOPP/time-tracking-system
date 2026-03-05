import { PartialType } from '@nestjs/mapped-types';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  IsDateString,
  Min,
  Max,
  MaxLength,
  IsOptional,
} from 'class-validator';

import { IsValidDateRange } from '../utils/dateValidation.decorator';

export class CreateTimeLogDto {
  @IsNotEmpty()
  @IsDateString()
  date: string;

  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 1 })
  @Min(0.1)
  @Max(24)
  hours: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(1500)
  description: string;

  @IsNotEmpty()
  @IsUUID()
  projectId: string;
}

export class UpdateTimeLogDto extends PartialType(CreateTimeLogDto) {}

import { OmitType } from '@nestjs/mapped-types';

export class BulkSaveTimeLogDto extends OmitType(CreateTimeLogDto, ['projectId'] as const) {
  @IsOptional()
  @IsUUID()
  id?: string;
}

@IsValidDateRange()
export class DateRangeQueryDto {
  @IsNotEmpty()
  @IsDateString()
  from: string;

  @IsNotEmpty()
  @IsDateString()
  to: string;
}

export class ManagerDashboardQueryDto extends DateRangeQueryDto {
  @IsOptional()
  @IsString()
  search?: string;
}

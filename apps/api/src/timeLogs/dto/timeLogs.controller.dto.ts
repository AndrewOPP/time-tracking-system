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
  ValidateIf,
} from 'class-validator';
import { OmitType } from '@nestjs/mapped-types';
import { IsValidDateRange } from '../utils/dateValidation.decorator';
import { IsInt } from 'class-validator';
import { Type } from 'class-transformer';

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

export class BulkSaveTimeLogDto extends OmitType(CreateTimeLogDto, [
  'projectId',
  'hours',
  'description',
] as const) {
  @IsOptional()
  @IsUUID()
  id?: string;

  @IsNumber({ maxDecimalPlaces: 1 })
  @Min(0)
  @Max(24)
  hours: number;

  @ValidateIf(object => object.hours > 0)
  @IsNotEmpty()
  @IsString()
  @MaxLength(1500)
  description: string;
}

export class UpdateTimeLogDto extends PartialType(CreateTimeLogDto) {}

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

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;
}

export class ProjectDateRangeQueryDto extends DateRangeQueryDto {
  @IsOptional()
  @IsUUID()
  projectId?: string;
}

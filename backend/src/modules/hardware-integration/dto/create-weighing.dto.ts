import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsUUID,
  IsNumber,
  IsOptional,
  IsString,
  IsEnum,
  IsDateString,
  IsArray,
  ValidateNested,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { WeighingSource } from '../enums/weighing-source.enum';

export class CreateWeighingDto {
  @ApiProperty({ description: 'Cattle UUID' })
  @IsUUID('all')
  idCattle: string;

  @ApiPropertyOptional({ description: '15-digit ISO 11784/11785 EID tag read by RFID reader' })
  @IsOptional()
  @IsString()
  eidTag?: string;

  @ApiProperty({ description: 'Gross weight in kg' })
  @IsNumber()
  @Min(0)
  grossWeightKg: number;

  @ApiPropertyOptional({ description: 'Net weight in kg (gross - tare)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  netWeightKg?: number;

  @ApiPropertyOptional({ description: 'Tare weight in kg' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  tareKg?: number;

  @ApiPropertyOptional({ description: 'Timestamp when scale reading stabilized' })
  @IsOptional()
  @IsDateString()
  stableAt?: string;

  @ApiPropertyOptional({ description: 'Operator user UUID' })
  @IsOptional()
  @IsUUID('all')
  operatorId?: string;

  @ApiProperty({ description: 'Source of the weighing', enum: WeighingSource, default: WeighingSource.MANUAL })
  @IsEnum(WeighingSource)
  source: WeighingSource;

  @ApiPropertyOptional({ description: 'Bridge device UUID that captured this weighing' })
  @IsOptional()
  @IsUUID('all')
  bridgeDeviceId?: string;

  @ApiPropertyOptional({ description: 'Notes or comments' })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateWeighingDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID('all')
  idCattle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  grossWeightKg?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  netWeightKg?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  tareKg?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  eidTag?: string;
}

export class BatchSyncWeighingDto {
  @ApiProperty({ type: [CreateWeighingDto], description: 'Array of weighing records from offline bridge queue' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateWeighingDto)
  records: CreateWeighingDto[];
}

export class WeighingQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID('all')
  idCattle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID('all')
  operatorId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @IsNumber()
  page?: number;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @IsNumber()
  limit?: number;
}

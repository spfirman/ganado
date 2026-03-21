import { IsNumber, IsNotEmpty, IsDateString, IsEnum, IsUUID, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { WeightContext } from '../entities/cattle-weight-history.entity';

export class RecordWeightDto {
  @ApiProperty({ example: 450.5, description: 'Weight in kilograms' })
  @IsNumber()
  @IsNotEmpty()
  weight: number;

  @ApiProperty({ example: '2025-12-07T20:00:00Z', description: 'Date when weight was measured' })
  @IsDateString()
  @IsNotEmpty()
  measuredDate: string;

  @ApiProperty({ example: 'SALE', enum: WeightContext, description: 'Context of measurement' })
  @IsEnum(WeightContext)
  @IsNotEmpty()
  context: string;

  @ApiPropertyOptional({ example: 'uuid', description: 'ID of user who recorded' })
  @IsUUID()
  @IsOptional()
  measuredBy?: string;
}

export class UpdateCattleWeightDto {
  @ApiProperty({ example: 450.5, description: 'New weight in kilograms' })
  @IsNumber()
  @IsNotEmpty()
  weight: number;
}

export class BulkUpdateCattleStatusDto {
  @ApiProperty({ example: ['uuid1', 'uuid2'], description: 'Array of cattle IDs' })
  @IsUUID('4', { each: true })
  @IsNotEmpty()
  cattleIds: string[];

  @ApiProperty({ example: 'SOLD', description: 'New status' })
  @IsNotEmpty()
  status: string;
}

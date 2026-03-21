import {
  IsUUID,
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsDateString,
  IsArray,
  IsEnum,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CattleGender } from '../enums/cattle-gender.enum';
import { CattleStatus } from '../entities/cattle.entity';

export class CreateCattleDto {
  idTenant?: string;

  @IsUUID()
  idDevice?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  deveui?: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  sysNumber: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  number: string;

  @ApiProperty({ required: false })
  @IsString()
  @MaxLength(50)
  @IsOptional()
  brand?: string;

  @ApiProperty({ required: true })
  @IsDateString()
  receivedAt: string;

  @ApiProperty({ required: true })
  @IsNumber()
  receivedWeight: number;

  @ApiProperty({ required: true })
  @IsNumber()
  purchaseWeight: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  comments?: string;

  @ApiProperty({ required: false })
  @IsString()
  purchasedFrom?: string;

  @ApiProperty({ required: true })
  @IsNumber()
  purchasePrice: number;

  @ApiProperty({ required: false })
  @IsNumber()
  purchaseCommission?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  negotiatedPricePerKg?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  lotPricePerWeight?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  salePrice?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  salePricePerKg?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  saleWeight?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  averageGr?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  color?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  characteristics?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  hasHorn?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  castrated?: boolean;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  eartagLeft?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  eartagRight?: string;

  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  idLot?: string;

  @ApiProperty({ required: false, enum: CattleGender })
  @IsEnum(CattleGender)
  @IsOptional()
  gender?: string;

  @ApiProperty({ required: false, enum: CattleStatus })
  @IsEnum(CattleStatus)
  @IsOptional()
  status?: string;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  birthDateAprx?: string;

  @ApiProperty({ required: false, description: 'Fecha en que la res inicia con la nueva alimentación' })
  @IsDateString()
  @IsOptional()
  newFeedStartDate?: string;

  @ApiProperty({ required: false, description: 'Ganancia diaria promedio (kg/día)' })
  @IsNumber()
  @IsOptional()
  averageDailyGain?: number;

  @ApiProperty({ required: true })
  @IsNumber()
  lastWeight: number;
}

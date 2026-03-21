import { Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsUUID,
  IsOptional,
  IsNumber,
  IsString,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { CreateSaleDetailDto } from './create-sale-detail.dto';

export class CreateSaleDto {
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  transactionDate: Date;

  @IsUUID()
  @IsNotEmpty()
  buyerId: string;

  @IsUUID()
  @IsOptional()
  transporterId?: string;

  @IsNumber()
  @IsNotEmpty()
  minWeightConfig: number;

  @IsNumber()
  @IsNotEmpty()
  valuePerKgConfig: number;

  @IsNumber()
  @IsNotEmpty()
  totalAnimalCount: number;

  @IsNumber()
  @IsNotEmpty()
  totalWeightKg: number;

  @IsNumber()
  @IsNotEmpty()
  totalAmount: number;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsOptional()
  @IsUUID()
  idTenant?: string;

  @IsOptional()
  @IsUUID()
  createdBy?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSaleDetailDto)
  details: CreateSaleDetailDto[];
}

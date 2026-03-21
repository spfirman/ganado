import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsDateString, IsArray } from 'class-validator';
import { CreateLotDto } from './create-lot.dto';

export class CreatePurchaseDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  idProvider: string;

  @ApiProperty()
  @IsDateString()
  purchaseDate: string;

  @ApiProperty({ type: [CreateLotDto] })
  @IsArray()
  lots: CreateLotDto[];
}

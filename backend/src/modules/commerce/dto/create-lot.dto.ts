import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { CattleGender } from '../../farm/enums/cattle-gender.enum';

export class CreateLotDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lotNumber: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  originPlace: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  purchasedCattleCount: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  totalWeight: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  pricePerKg: number;

  @ApiProperty()
  @IsNumber()
  totalValue: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  gender: string;
}

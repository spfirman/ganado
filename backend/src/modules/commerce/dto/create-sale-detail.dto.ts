import { IsUUID, IsNotEmpty, IsString, IsNumber, IsBoolean, IsOptional } from 'class-validator';

export class CreateSaleDetailDto {
  @IsUUID()
  @IsNotEmpty()
  cattleId: string;

  @IsString()
  @IsNotEmpty()
  cattleNumber: string;

  @IsNumber()
  @IsNotEmpty()
  measuredWeight: number;

  @IsBoolean()
  @IsNotEmpty()
  isApproved: boolean;

  @IsString()
  @IsOptional()
  rejectionReason?: string;

  @IsBoolean()
  @IsOptional()
  trackerRemoved?: boolean;

  @IsNumber()
  @IsNotEmpty()
  calculatedPrice: number;
}

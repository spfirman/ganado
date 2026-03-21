import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEnum } from 'class-validator';
import { PurchaseStatus } from '../enums/purchase-status.enum';

export class UpdatePurchaseStatusDto {
  @ApiProperty({ enum: PurchaseStatus })
  @IsNotEmpty()
  @IsEnum(PurchaseStatus)
  status: string;
}

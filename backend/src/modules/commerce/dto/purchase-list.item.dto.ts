import { ApiProperty } from '@nestjs/swagger';

export class PurchaseListItemDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  purchaseDate: string;

  @ApiProperty({ nullable: true })
  providerName: string | null;

  @ApiProperty({ example: 12000 })
  totalWeight: number;

  @ApiProperty({ example: 42 })
  totalCattle: number;

  @ApiProperty({ example: 38 })
  receivedCattle: number;

  @ApiProperty({ example: 10980 })
  receivedWeight: number;

  @ApiProperty({ example: 'OPEN' })
  status: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { CattleGender } from '../../farm/enums/cattle-gender.enum';
import { Lot } from '../entities/lot.entity';

export class LotResponseDto {
  @ApiProperty({ example: '111454e1-9bba-4447-a00e-567334cc51d4', description: 'Unique identifier of the lot' })
  id: string;

  @ApiProperty({ example: 'L-001', description: 'Lot number or label' })
  lotNumber: string;

  @ApiProperty({ example: '123454e1-9bba-4447-a00e-567334cc51d4', description: 'Unique identifier of the purchase' })
  idPurchase: string;

  @ApiProperty({ example: 'Farm A - Zone 3', description: 'Lot origin place' })
  originPlace: string;

  @ApiProperty({ example: 12, description: 'Number of cattle in the lot' })
  purchasedCattleCount: number;

  @ApiProperty({ example: 840.5, description: 'Total weight (kg) of cattle in the lot' })
  totalWeight: number;

  @ApiProperty({ example: 6500, description: 'Price per kilogram in the lot' })
  pricePerKg: number;

  @ApiProperty({ example: 5460000, description: 'Total monetary value of the lot' })
  totalValue: number;

  @ApiProperty({ example: 'Male', description: 'Sex of the cattle in the lot' })
  gender: string;

  static toLotResponse(lot: Lot): LotResponseDto {
    return {
      id: lot.id,
      lotNumber: lot.lotNumber,
      idPurchase: lot.idPurchase,
      originPlace: lot.originPlace,
      purchasedCattleCount: lot.purchasedCattleCount,
      totalWeight: lot.totalWeight,
      pricePerKg: lot.pricePerKg,
      totalValue: lot.totalValue,
      gender: lot.gender,
    };
  }
}

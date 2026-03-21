import { Lot } from '../entities/lot.entity';
export declare class LotResponseDto {
    id: string;
    lotNumber: string;
    idPurchase: string;
    originPlace: string;
    purchasedCattleCount: number;
    totalWeight: number;
    pricePerKg: number;
    totalValue: number;
    gender: string;
    static toLotResponse(lot: Lot): LotResponseDto;
}

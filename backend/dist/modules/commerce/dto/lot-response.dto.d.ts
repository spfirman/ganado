import { Lot } from '../entities/lot.entity';
import { CattleGender } from '../../farm/enums/cattle-gender.enum';
export declare class LotResponseDto {
    id: string;
    lotNumber: string;
    idPurchase: string;
    originPlace: string;
    purchasedCattleCount: number;
    totalWeight: number;
    pricePerKg: number;
    totalValue: number;
    gender: CattleGender;
    static toLotResponse(lot: Lot): LotResponseDto;
}

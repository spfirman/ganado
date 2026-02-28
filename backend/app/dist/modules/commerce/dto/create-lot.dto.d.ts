import { CattleGender } from '../../farm/enums/cattle-gender.enum';
export declare class CreateLotDto {
    lotNumber: string;
    originPlace: string;
    purchasedCattleCount: number;
    totalWeight: number;
    pricePerKg: number;
    totalValue: number;
    gender: CattleGender;
}

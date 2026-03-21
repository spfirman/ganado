import { Purchase } from './purchase.entity';
export declare class Lot {
    id: string;
    idTenant: string;
    lotNumber: string;
    originPlace: string;
    purchasedCattleCount: number;
    receivedCattleCount: number;
    averageWeight: number;
    totalWeight: number;
    receivedTotalWeight: number;
    pricePerKg: number;
    totalValue: number;
    gender: string;
    idPurchase: string;
    purchase: Purchase;
    created_at: Date;
    updated_at: Date;
}

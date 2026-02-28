import { LotResponseDto } from './lot-response.dto';
import { Purchase } from '../entities/purchase.entity';
export declare class PurchaseResponseDto {
    id: string;
    idProvider: string;
    purchaseDate: string;
    totalCattle: number;
    totalWeight: number;
    lots: LotResponseDto[];
    static toPurchaseResponse(purchase: Purchase): PurchaseResponseDto;
}

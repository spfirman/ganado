import { Lot } from './lot.entity';
import { Cattle } from '../../farm/entities/cattle.entity';
export declare class Purchase {
    id: string;
    idTenant: string;
    purchaseDate: Date;
    totalCattle: number;
    totalWeight: number;
    status: string;
    idProvider: string;
    lots: Lot[];
    cattle: Cattle[];
    idCreatedBy: string;
    idUpdatedBy: string;
    createdAt: Date;
    updatedAt: Date;
}

import { Sale } from './sale.entity';
import { Cattle } from '../../farm/entities/cattle.entity';
export declare class SaleDetail {
    id: string;
    saleId: string;
    sale: Sale;
    cattleId: string;
    cattle: Cattle;
    measuredWeight: number;
    isApproved: boolean;
    rejectionReason: string;
    trackerRemoved: boolean;
    calculatedPrice: number;
    idTenant: string;
    createdAt: Date;
}

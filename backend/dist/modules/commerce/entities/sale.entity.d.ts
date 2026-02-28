import { Provider } from './provider.entity';
import { SaleDetail } from './sale-detail.entity';
export declare class Sale {
    id: string;
    transactionDate: Date;
    buyerId: string;
    buyer: Provider;
    transporterId: string;
    transporter: Provider;
    minWeightConfig: number;
    valuePerKgConfig: number;
    totalAnimalCount: number;
    totalWeightKg: number;
    totalAmount: number;
    notes: string;
    details: SaleDetail[];
    idTenant: string;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
}

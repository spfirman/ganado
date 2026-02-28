import { CreateSaleDetailDto } from './create-sale-detail.dto';
export declare class CreateSaleDto {
    transactionDate: Date;
    buyerId: string;
    transporterId?: string;
    minWeightConfig: number;
    valuePerKgConfig: number;
    totalAnimalCount: number;
    totalWeightKg: number;
    totalAmount: number;
    notes?: string;
    idTenant?: string;
    createdBy?: string;
    details: CreateSaleDetailDto[];
}

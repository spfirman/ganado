import { WeighingSource } from '../enums/weighing-source.enum';
export declare class CreateWeighingDto {
    idCattle: string;
    eidTag?: string;
    grossWeightKg: number;
    netWeightKg?: number;
    tareKg?: number;
    stableAt?: string;
    operatorId?: string;
    source: WeighingSource;
    bridgeDeviceId?: string;
    notes?: string;
}
export declare class UpdateWeighingDto {
    idCattle?: string;
    grossWeightKg?: number;
    netWeightKg?: number;
    tareKg?: number;
    notes?: string;
    eidTag?: string;
}
export declare class BatchSyncWeighingDto {
    records: CreateWeighingDto[];
}
export declare class WeighingQueryDto {
    idCattle?: string;
    operatorId?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
}

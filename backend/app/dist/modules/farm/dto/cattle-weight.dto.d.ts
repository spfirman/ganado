import { WeightContext } from '../entities/cattle-weight-history.entity';
export declare class RecordWeightDto {
    weight: number;
    measuredDate: string;
    context: WeightContext;
    measuredBy?: string;
}
export declare class UpdateCattleWeightDto {
    weight: number;
}
export declare class BulkUpdateCattleStatusDto {
    cattleIds: string[];
    status: string;
}

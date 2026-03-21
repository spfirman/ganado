export declare class RecordWeightDto {
    weight: number;
    measuredDate: string;
    context: string;
    measuredBy?: string;
}
export declare class UpdateCattleWeightDto {
    weight: number;
}
export declare class BulkUpdateCattleStatusDto {
    cattleIds: string[];
    status: string;
}

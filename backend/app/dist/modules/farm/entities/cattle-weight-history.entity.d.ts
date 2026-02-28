export declare enum WeightContext {
    SALE = "SALE",
    PURCHASE = "PURCHASE",
    EVENT = "EVENT",
    MANUAL = "MANUAL",
    RECEIVED = "RECEIVED"
}
export declare class CattleWeightHistory {
    id: string;
    idTenant: string;
    idCattle: string;
    weight: number;
    date: Date;
    context: WeightContext;
    idMassiveEvent?: string;
    recordedBy?: string;
}

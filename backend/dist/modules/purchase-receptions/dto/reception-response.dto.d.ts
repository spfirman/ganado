import { SimpleEventResponseDto } from '../../massive-events/dto/simple-event-response.dto';
export declare class AnimalSimpleEventReceptionResponseDto {
    id: string;
    data: Record<string, any>;
    appliedAt: string;
    static toResponseDto(entity: any): AnimalSimpleEventReceptionResponseDto;
}
export declare class CattleReceptionResponseDto {
    id: string;
    number: string;
    sysNumber: string;
    receivedWeight: number;
    idDevice: string;
    deviceName: string;
    eartagLeft: string;
    eartagRight: string;
    appliedEvents: any[];
    static toResponseDto(entity: any, appliedEvents: any[]): CattleReceptionResponseDto;
}
export declare class LotReceptionResponseDto {
    id: string;
    lotNumber: string;
    purchasedCattleCount: number;
    pricePerKg: number;
    totalWeight: number;
    receivedCattleCount: number;
    receivedTotalWeight: number;
    cattle: CattleReceptionResponseDto[];
    static toResponseDto(entity: any, lotCattle: any[], appliedEvents: Record<string, any[]>): LotReceptionResponseDto;
}
export declare class ReceptionMassiveEventResponseDto {
    id: string;
    simpleEvents: SimpleEventResponseDto[];
    status: string;
    static toResponseDto(entity: any): ReceptionMassiveEventResponseDto;
}
export declare class PurchaseReceptionResponseDto {
    id: string;
    purchaseId: string;
    purchaseStatus: string;
    providerId: string;
    massEventId: string;
    nextCattleNumber: string;
    purchaseDate: string;
    purchaseProviderName: string;
    receivedAt: string;
    lots: LotReceptionResponseDto[];
    cattle: CattleReceptionResponseDto[];
    massiveEvent: ReceptionMassiveEventResponseDto;
    receivedCattleCount: number;
    receivedTotalWeight: number;
    purchaseCattleCount: number;
    purchaseTotalWeight: number;
    static toResponseDto(entity: any, purchase?: any, providerName?: string, lots?: any[], lotCattle?: Record<string, any[]>, cattle?: any[], appliedEvents?: Record<string, any[]>, massiveEvent?: any): PurchaseReceptionResponseDto;
}
export declare class ReceptionResponseDto {
    reception: PurchaseReceptionResponseDto;
    static toResponseDto(receptionInfo: any): ReceptionResponseDto;
    static toResponseDto_optional(entity: any, purchase: any, providerName: string, lots: any[], lotCattle: Record<string, any[]>, cattle: any[], appliedEvents: Record<string, any[]>, massiveEvent: any): ReceptionResponseDto;
}

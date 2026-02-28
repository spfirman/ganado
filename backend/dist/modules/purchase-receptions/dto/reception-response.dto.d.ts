import { AnimalSimpleEvent } from '../../massive-events/entities/animal-simple-event.entity';
import { Cattle } from '../../farm/entities/cattle.entity';
import { Lot } from '../../commerce/entities/lot.entity';
import { PurchaseReception } from '../entities/purchase-reception.entity';
import { Purchase } from '../../commerce/entities/purchase.entity';
import { MassiveEvent } from '../../massive-events/entities/massive-events.entity';
import { SimpleEventResponseDto } from 'src/modules/massive-events/dto/simple-event-response.dto';
export declare class AnimalSimpleEventReceptionResponseDto {
    id: string;
    data: any;
    appliedAt: string;
    static toResponseDto(entity: AnimalSimpleEvent): AnimalSimpleEventReceptionResponseDto;
}
export declare class CattleReceptionResponseDto {
    id: string;
    number: string;
    sysNumber: string;
    receivedWeight: number;
    idDevice: string;
    deviceName: string;
    eartagLeft?: string;
    eartagRight?: string;
    appliedEvents: AnimalSimpleEventReceptionResponseDto[];
    static toResponseDto(entity: Cattle, appliedEvents: AnimalSimpleEvent[]): CattleReceptionResponseDto;
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
    static toResponseDto(entity: Lot, lotCattle: Cattle[], appliedEvents: Record<string, AnimalSimpleEvent[]>): LotReceptionResponseDto;
}
export declare class ReceptionMassiveEventResponseDto {
    id: string;
    simpleEvents: SimpleEventResponseDto[];
    status: string;
    static toResponseDto(entity: MassiveEvent): ReceptionMassiveEventResponseDto;
}
export declare class PurchaseReceptionResponseDto {
    id: string;
    purchaseId: string;
    purchaseStatus: string;
    providerId: string;
    massEventId?: string;
    nextCattleNumber?: string;
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
    static toResponseDto(entity: PurchaseReception, purchase: Purchase, providerName: string, lots: Lot[], lotCattle: Record<string, Cattle[]>, cattle: Cattle[], appliedEvents: Record<string, AnimalSimpleEvent[]>, massiveEvent: MassiveEvent): PurchaseReceptionResponseDto;
}
export declare class ReceptionResponseDto {
    reception: PurchaseReceptionResponseDto;
    static toResponseDto(receptionInfo: PurchaseReceptionResponseDto): ReceptionResponseDto;
    static toResponseDto_optional(entity: PurchaseReception, purchase: Purchase, providerName: string, lots: Lot[], lotCattle: Record<string, Cattle[]>, cattle: Cattle[], appliedEvents: Record<string, AnimalSimpleEvent[]>, massiveEvent: MassiveEvent): ReceptionResponseDto;
}

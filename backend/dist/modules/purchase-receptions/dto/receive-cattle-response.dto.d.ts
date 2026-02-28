import { Cattle } from "src/modules/farm/entities/cattle.entity";
import { SimpleEventType } from "src/modules/massive-events/enums/simple-event-type.enum";
export declare class ReceiveCattleResponseDto {
    id: string;
    idTenant: string;
    sysnumber: string;
    number: string;
    idLot?: string;
    idBrand?: string;
    color?: string;
    idDevice?: string;
    eartagLeft?: string;
    eartagRight?: string;
    deviceName?: string;
    appliedEvents: Array<{
        type: SimpleEventType;
        data: any;
        appliedBy?: string;
        appliedAt?: Date;
        idSimpleEvent: string;
    }>;
    static toResponseDto(cattle: Cattle, appliedEvents: any[]): ReceiveCattleResponseDto;
}

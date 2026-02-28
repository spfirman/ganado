import { SimpleEventType } from '../enums/simple-event-type.enum';
export declare class SyncSimpleEventDto {
    id: string;
    idTenant: string;
    massiveEventServerId: string;
    type: SimpleEventType;
    dataJson?: string;
    isActive?: boolean;
    createdAt?: string;
    createdBy?: string;
}
export declare class SyncSimpleEventsRequestDto {
    simpleEvents: SyncSimpleEventDto[];
}
export declare class SyncSimpleEventResultDto {
    id: string;
    status: string;
    serverId: string;
    message?: string;
}
export declare class SyncSimpleEventsResponseDto {
    results: SyncSimpleEventResultDto[];
}

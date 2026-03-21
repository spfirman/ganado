export declare class SyncSimpleEventDto {
    id: string;
    idTenant: string;
    massiveEventServerId: string;
    type: string;
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

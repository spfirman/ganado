export declare class SyncSimpleEventInputDto {
    id: string;
    type: string;
    dataJson?: string;
    createdAt?: string;
}
export declare class SyncMassiveEventDto {
    id: string;
    idTenant: string;
    eventDate: string;
    status: string;
    createdBy?: string;
    createdAt?: string;
    updatedAt?: string;
    simpleEvents?: SyncSimpleEventInputDto[];
}
export declare class SyncMassiveEventsRequestDto {
    massiveEvents: SyncMassiveEventDto[];
}
export declare class SyncMassiveEventResultDto {
    id: string;
    status: string;
    message?: string;
}
export declare class SyncMassiveEventsResponseDto {
    results: SyncMassiveEventResultDto[];
}

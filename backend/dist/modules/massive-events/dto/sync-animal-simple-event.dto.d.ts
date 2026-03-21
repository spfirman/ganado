export declare class SyncAnimalSimpleEventDto {
    id: string;
    idTenant: string;
    cattleNumber: string;
    type: string;
    dataJson?: string;
    appliedAt: string;
    appliedBy?: string;
    idMassiveEvent?: string;
    idSimpleEvent?: string;
}
export declare class SyncAnimalSimpleEventRequestDto {
    animalSimpleEvent: SyncAnimalSimpleEventDto[];
}
export declare class SyncAnimalSimpleEventResultDto {
    id: string;
    status: string;
    animalServerId?: string;
    message?: string;
}
export declare class SyncAnimalSimpleEventResponseDto {
    results: SyncAnimalSimpleEventResultDto[];
}

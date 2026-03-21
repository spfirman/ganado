declare class SingleEventDto {
    cattleNumber: string;
    type: string;
    data: any;
    appliedBy?: string;
    appliedAt?: Date;
    idMassiveEvent: string;
    idSimpleEvent: string;
}
export declare class ApplySimpleEventsDto {
    events: SingleEventDto[];
}
export {};

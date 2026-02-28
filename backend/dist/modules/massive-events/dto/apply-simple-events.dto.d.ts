import { SimpleEventType } from '../enums/simple-event-type.enum';
declare class SingleEventDto {
    cattleNumber: string;
    type: SimpleEventType;
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

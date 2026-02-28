import { SimpleEventType } from '../enums/simple-event-type.enum';
declare class SimpleEventInputDto {
    type: SimpleEventType;
    data?: any;
}
export declare class CreateMassiveEventDto {
    eventDate: string;
    simpleEvents?: SimpleEventInputDto[];
}
export {};

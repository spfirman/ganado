import { SimpleEventType } from '../enums/simple-event-type.enum';
export declare class ApplySimpleEventsResponseDto {
    id: string;
    idTenant: string;
    idAnimal: string;
    animalNumber: string;
    type: SimpleEventType;
    data: any;
    appliedBy?: string;
    appliedAt: Date;
    idMassiveEvent: string;
    idSimpleEvent: string;
}

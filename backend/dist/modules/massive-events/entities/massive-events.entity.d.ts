import { SimpleEvent } from './simple-event.entity';
export declare class MassiveEvent {
    id: string;
    idTenant: string;
    name: string;
    eventDate: Date;
    status: string;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
    simpleEvents: SimpleEvent[];
}

import { SimpleEventType } from '../enums/simple-event-type.enum';
import { MassiveEvent } from './massive-events.entity';
export declare class SimpleEvent {
    id: string;
    idTenant: string;
    idMassiveEvent: string;
    massiveEvent: MassiveEvent;
    type: SimpleEventType;
    isActive: boolean;
    data?: any;
    createdAt: Date;
}

import { MassiveEvent } from './massive-events.entity';
export declare class SimpleEvent {
    id: string;
    idTenant: string;
    idMassiveEvent: string;
    massiveEvent: MassiveEvent;
    type: string;
    isActive: boolean;
    data: any;
    createdAt: Date;
}

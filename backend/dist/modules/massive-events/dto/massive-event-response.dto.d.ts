import { MassiveEvent } from '../entities/massive-events.entity';
import { SimpleEvent } from '../entities/simple-event.entity';
import { SimpleEventResponseDto } from './simple-event-response.dto';
export declare class MassiveEventResponseDto {
    id: string;
    idTenant: string;
    status: string;
    eventDate: Date;
    createdAt: Date;
    updatedAt: Date;
    simpleEvents: SimpleEventResponseDto[];
    static toResponseDto(entity: MassiveEvent, simpleEvents?: SimpleEvent[]): MassiveEventResponseDto;
}

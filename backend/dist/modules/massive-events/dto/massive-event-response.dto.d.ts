import { SimpleEventResponseDto } from './simple-event-response.dto';
export declare class MassiveEventResponseDto {
    id: string;
    idTenant: string;
    status: string;
    eventDate: Date;
    createdAt: Date;
    updatedAt: Date;
    simpleEvents: SimpleEventResponseDto[];
    static toResponseDto(entity: any, simpleEvents?: any[]): MassiveEventResponseDto;
}

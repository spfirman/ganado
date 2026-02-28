import { SimpleEvent } from '../entities/simple-event.entity';
export declare class SimpleEventResponseDto {
    id: string;
    idTenant: string;
    type: string;
    idMassiveEvent: string;
    createdAt: Date;
    data: String;
    isActive: boolean;
    static toResponseDto(entity: SimpleEvent): SimpleEventResponseDto;
}

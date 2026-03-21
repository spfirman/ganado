export declare class SimpleEventResponseDto {
    id: string;
    idTenant: string;
    type: string;
    idMassiveEvent: string;
    createdAt: Date;
    data: string;
    isActive: boolean;
    static toResponseDto(entity: any): SimpleEventResponseDto;
}

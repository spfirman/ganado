declare class SimpleEventInputDto {
    type: string;
    data?: any;
}
export declare class CreateMassiveEventDto {
    eventDate: string;
    simpleEvents?: SimpleEventInputDto[];
}
export {};

export declare class ReceiveCattleResponseDto {
    id: string;
    idTenant: string;
    sysnumber: string;
    number: string;
    idLot: string;
    idBrand: string;
    color: string;
    idDevice: string;
    eartagLeft: string;
    eartagRight: string;
    deviceName: string;
    appliedEvents: any[];
    static toResponseDto(cattle: any, appliedEvents?: any[]): ReceiveCattleResponseDto;
}

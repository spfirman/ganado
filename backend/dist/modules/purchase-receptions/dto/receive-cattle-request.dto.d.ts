export declare class ReceiveCattleRequestDto {
    idPurchase: string;
    number: string;
    receivedWeight: number;
    purchaseWeight: number;
    purchasePrice: number;
    hasHorn: boolean;
    castrated: boolean;
    idLot: string;
    idBrand: string;
    color: string;
    characteristics: string[];
    eartagLeft: string;
    eartagRight: string;
    idDevice: string;
    comments: string;
    idProvider: string;
    idSimpleEvents: string[];
    gender: string;
    birthDateAprx: string;
}
export declare class UpdateLotCattleRequestDto {
    idLot: string;
    idCattle: string;
}

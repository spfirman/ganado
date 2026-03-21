import { Device } from '../../production-center/entities/device.entity';
import { Purchase } from '../../commerce/entities/purchase.entity';
import { CattleCharacteristic } from './cattle-characteristic.entity';
export declare enum CattleStatus {
    ACTIVE = "ACTIVE",
    SOLD = "SOLD",
    DEAD = "DEAD",
    LOST = "LOST"
}
export declare class Cattle {
    id: string;
    idTenant: string;
    sysNumber: string;
    number: string;
    receivedAt: Date;
    receivedWeight: number;
    idPurchase: string;
    purchase: Purchase;
    purchaseWeight: number;
    purchasePrice: number;
    idLot: string | null;
    idBrand: string | null;
    color: string;
    cattleCharacteristics: CattleCharacteristic[];
    eidTag: string | null;
    eartagLeft: string | null;
    eartagRight: string | null;
    idDevice: string | null;
    device: Device;
    castrated: boolean;
    castrationDate: Date;
    comments: string | null;
    purchaseCommission: number;
    negotiatedPricePerKg: number;
    lotPricePerWeight: number;
    salePrice: number;
    salePricePerKg: number;
    saleWeight: number;
    averageGr: number;
    purchasedFrom: string;
    idProvider: string;
    lastWeight: number;
    hasHorn: boolean;
    status: string;
    gender: string;
    birthDateAprx: Date | null;
    newFeedStartDate: Date | null;
    averageDailyGain: number | null;
    createdAt: Date;
    updatedAt: Date;
}

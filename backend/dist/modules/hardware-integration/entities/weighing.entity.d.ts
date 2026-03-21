import { Cattle } from '../../farm/entities/cattle.entity';
import { WeighingSource } from '../enums/weighing-source.enum';
import { WeighingMedia } from './weighing-media.entity';
export declare class Weighing {
    id: string;
    idTenant: string;
    idCattle: string;
    cattle: Cattle;
    eidTag: string | null;
    grossWeightKg: number;
    netWeightKg: number | null;
    tareKg: number | null;
    stableAt: Date | null;
    operatorId: string | null;
    source: WeighingSource;
    bridgeDeviceId: string | null;
    notes: string | null;
    media: WeighingMedia[];
    createdAt: Date;
    updatedAt: Date;
}

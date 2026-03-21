import { Weighing } from './weighing.entity';
import { WeighingMediaType } from '../enums/weighing-source.enum';
export declare class WeighingMedia {
    id: string;
    idTenant: string;
    weighingId: string;
    weighing: Weighing;
    type: WeighingMediaType;
    url: string;
    thumbnailUrl: string | null;
    capturedAt: Date | null;
    fileSizeBytes: number | null;
    createdAt: Date;
}

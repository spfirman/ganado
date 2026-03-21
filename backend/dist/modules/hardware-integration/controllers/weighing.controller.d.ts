import { WeighingService } from '../services/weighing.service';
import { CreateWeighingDto, UpdateWeighingDto, WeighingQueryDto, BatchSyncWeighingDto } from '../dto/create-weighing.dto';
import { RegisterDeviceDto, DeviceHeartbeatDto } from '../dto/bridge-device.dto';
import { WeighingMediaType } from '../enums/weighing-source.enum';
export declare class WeighingController {
    private readonly weighingService;
    constructor(weighingService: WeighingService);
    createWeighing(req: any, dto: CreateWeighingDto): Promise<import("../entities/weighing.entity").Weighing>;
    listWeighings(req: any, query: WeighingQueryDto): Promise<{
        results: import("../entities/weighing.entity").Weighing[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getWeighing(req: any, id: string): Promise<import("../entities/weighing.entity").Weighing>;
    updateWeighing(req: any, id: string, dto: UpdateWeighingDto): Promise<import("../entities/weighing.entity").Weighing>;
    uploadMedia(req: any, id: string, file: any, type: WeighingMediaType): Promise<import("../entities/weighing-media.entity").WeighingMedia>;
    batchSync(req: any, dto: BatchSyncWeighingDto): Promise<{
        total: number;
        succeeded: number;
        failed: number;
        results: {
            index: number;
            success: boolean;
            id?: string;
            error?: string;
        }[];
    }>;
    findCattleByEid(req: any, eid: string): Promise<{
        found: boolean;
        eid: string;
        message: string;
        cattle?: undefined;
    } | {
        found: boolean;
        eid: string;
        cattle: import("../../farm/entities/cattle.entity").Cattle;
        message?: undefined;
    }>;
    registerDevice(req: any, dto: RegisterDeviceDto): Promise<import("../entities/bridge-device.entity").BridgeDevice>;
    listDevices(req: any): Promise<import("../entities/bridge-device.entity").BridgeDevice[]>;
    deviceHeartbeat(id: string, dto: DeviceHeartbeatDto, apiKey: string): Promise<{
        status: string;
        pollIntervalMs: number;
    }>;
    revokeDevice(req: any, id: string): Promise<void>;
    getBridgeStatus(req: any): Promise<{
        devices: {
            id: string;
            name: string;
            type: import("../enums/weighing-source.enum").BridgeDeviceType;
            status: import("../enums/weighing-source.enum").BridgeDeviceStatus;
            lastSeenAt: Date;
            ipAddress: string;
        }[];
        pollIntervalMs: number;
        timestamp: string;
    }>;
}

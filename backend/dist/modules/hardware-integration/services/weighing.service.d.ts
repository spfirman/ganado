import { Repository, DataSource } from 'typeorm';
import { Weighing } from '../entities/weighing.entity';
import { WeighingMedia } from '../entities/weighing-media.entity';
import { WeighingAuditLog } from '../entities/weighing-audit-log.entity';
import { BridgeDevice } from '../entities/bridge-device.entity';
import { CreateWeighingDto, UpdateWeighingDto, WeighingQueryDto, BatchSyncWeighingDto } from '../dto/create-weighing.dto';
import { RegisterDeviceDto } from '../dto/bridge-device.dto';
import { Cattle } from '../../farm/entities/cattle.entity';
import { CattleWeightHistory } from '../../farm/entities/cattle-weight-history.entity';
export declare class WeighingService {
    private readonly weighingRepo;
    private readonly mediaRepo;
    private readonly auditLogRepo;
    private readonly deviceRepo;
    private readonly cattleRepo;
    private readonly weightHistoryRepo;
    private readonly dataSource;
    constructor(weighingRepo: Repository<Weighing>, mediaRepo: Repository<WeighingMedia>, auditLogRepo: Repository<WeighingAuditLog>, deviceRepo: Repository<BridgeDevice>, cattleRepo: Repository<Cattle>, weightHistoryRepo: Repository<CattleWeightHistory>, dataSource: DataSource);
    createWeighing(tenantId: string, dto: CreateWeighingDto, userId?: string): Promise<Weighing>;
    getWeighing(tenantId: string, id: string): Promise<Weighing>;
    listWeighings(tenantId: string, query: WeighingQueryDto): Promise<{
        results: Weighing[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    updateWeighing(tenantId: string, id: string, dto: UpdateWeighingDto, userId: string): Promise<Weighing>;
    batchSync(tenantId: string, dto: BatchSyncWeighingDto, userId?: string): Promise<{
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
    addMedia(tenantId: string, weighingId: string, media: Partial<WeighingMedia>): Promise<WeighingMedia>;
    findCattleByEid(tenantId: string, eid: string): Promise<Cattle | null>;
    registerDevice(tenantId: string, dto: RegisterDeviceDto): Promise<BridgeDevice>;
    listDevices(tenantId: string): Promise<BridgeDevice[]>;
    deviceHeartbeat(deviceId: string, apiKey: string): Promise<{
        status: string;
        pollIntervalMs: number;
    }>;
    revokeDevice(tenantId: string, deviceId: string): Promise<void>;
}

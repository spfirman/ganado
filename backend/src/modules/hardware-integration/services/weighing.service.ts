import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, Between, FindOptionsWhere } from 'typeorm';
import { Weighing } from '../entities/weighing.entity';
import { WeighingMedia } from '../entities/weighing-media.entity';
import { WeighingAuditLog } from '../entities/weighing-audit-log.entity';
import { BridgeDevice } from '../entities/bridge-device.entity';
import { CreateWeighingDto, UpdateWeighingDto, WeighingQueryDto, BatchSyncWeighingDto } from '../dto/create-weighing.dto';
import { RegisterDeviceDto } from '../dto/bridge-device.dto';
import { BridgeDeviceStatus, WeighingSource } from '../enums/weighing-source.enum';
import { Cattle } from '../../farm/entities/cattle.entity';
import { CattleWeightHistory, WeightContext } from '../../farm/entities/cattle-weight-history.entity';
import * as crypto from 'crypto';

@Injectable()
export class WeighingService {
  constructor(
    @InjectRepository(Weighing)
    private readonly weighingRepo: Repository<Weighing>,
    @InjectRepository(WeighingMedia)
    private readonly mediaRepo: Repository<WeighingMedia>,
    @InjectRepository(WeighingAuditLog)
    private readonly auditLogRepo: Repository<WeighingAuditLog>,
    @InjectRepository(BridgeDevice)
    private readonly deviceRepo: Repository<BridgeDevice>,
    @InjectRepository(Cattle)
    private readonly cattleRepo: Repository<Cattle>,
    @InjectRepository(CattleWeightHistory)
    private readonly weightHistoryRepo: Repository<CattleWeightHistory>,
    private readonly dataSource: DataSource,
  ) {}

  // ─── Weighing CRUD ───────────────────────────────────────────────────────

  async createWeighing(tenantId: string, dto: CreateWeighingDto, userId?: string): Promise<Weighing> {
    // Verify cattle exists
    const cattle = await this.cattleRepo.findOne({
      where: { id: dto.idCattle, idTenant: tenantId },
    });
    if (!cattle) throw new NotFoundException(`Cattle not found: ${dto.idCattle}`);

    return this.dataSource.transaction(async (manager) => {
      // Create the weighing record
      const weighing = manager.create(Weighing, {
        idTenant: tenantId,
        idCattle: dto.idCattle,
        eidTag: dto.eidTag || null,
        grossWeightKg: dto.grossWeightKg,
        netWeightKg: dto.netWeightKg || null,
        tareKg: dto.tareKg || null,
        stableAt: dto.stableAt ? new Date(dto.stableAt) : null,
        operatorId: dto.operatorId || userId || null,
        source: dto.source || WeighingSource.MANUAL,
        bridgeDeviceId: dto.bridgeDeviceId || null,
        notes: dto.notes || null,
      });
      const saved = await manager.save(Weighing, weighing);

      // Also update cattle's lastWeight and create weight history
      const effectiveWeight = dto.netWeightKg || dto.grossWeightKg;
      await manager.update(Cattle, { id: dto.idCattle }, { lastWeight: effectiveWeight });

      const history = manager.create(CattleWeightHistory, {
        idTenant: tenantId,
        idCattle: dto.idCattle,
        weight: effectiveWeight,
        date: new Date(),
        context: dto.source === WeighingSource.AUTOMATIC ? WeightContext.EVENT : WeightContext.MANUAL,
        recordedBy: dto.operatorId || userId || null,
      });
      await manager.save(CattleWeightHistory, history);

      return saved;
    });
  }

  async getWeighing(tenantId: string, id: string): Promise<Weighing> {
    const weighing = await this.weighingRepo.findOne({
      where: { id, idTenant: tenantId },
      relations: ['cattle', 'media'],
    });
    if (!weighing) throw new NotFoundException(`Weighing not found: ${id}`);
    return weighing;
  }

  async listWeighings(tenantId: string, query: WeighingQueryDto) {
    const where: FindOptionsWhere<Weighing> = { idTenant: tenantId };
    if (query.idCattle) where.idCattle = query.idCattle;
    if (query.operatorId) where.operatorId = query.operatorId;

    const page = query.page || 1;
    const limit = query.limit || 20;

    const [results, total] = await this.weighingRepo.findAndCount({
      where,
      relations: ['cattle', 'media'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { results, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async updateWeighing(tenantId: string, id: string, dto: UpdateWeighingDto, userId: string): Promise<Weighing> {
    const weighing = await this.weighingRepo.findOne({
      where: { id, idTenant: tenantId },
    });
    if (!weighing) throw new NotFoundException(`Weighing not found: ${id}`);

    // Create audit log entries for each changed field
    const auditLogs: Partial<WeighingAuditLog>[] = [];
    for (const [key, newValue] of Object.entries(dto)) {
      if (newValue !== undefined && newValue !== (weighing as any)[key]) {
        auditLogs.push({
          idTenant: tenantId,
          weighingId: id,
          fieldChanged: key,
          oldValue: String((weighing as any)[key]),
          newValue: String(newValue),
          changedBy: userId,
        });
      }
    }

    return this.dataSource.transaction(async (manager) => {
      // Save audit logs
      if (auditLogs.length > 0) {
        await manager.save(WeighingAuditLog, auditLogs);
      }

      // Update the weighing
      Object.assign(weighing, dto);
      const updated = await manager.save(Weighing, weighing);

      // If weight changed, also update cattle's lastWeight
      if (dto.grossWeightKg || dto.netWeightKg) {
        const effectiveWeight = dto.netWeightKg || dto.grossWeightKg || weighing.netWeightKg || weighing.grossWeightKg;
        await manager.update(Cattle, { id: weighing.idCattle }, { lastWeight: effectiveWeight });
      }

      return updated;
    });
  }

  async batchSync(tenantId: string, dto: BatchSyncWeighingDto, userId?: string) {
    const results: { index: number; success: boolean; id?: string; error?: string }[] = [];

    for (let i = 0; i < dto.records.length; i++) {
      try {
        const weighing = await this.createWeighing(tenantId, dto.records[i], userId);
        results.push({ index: i, success: true, id: weighing.id });
      } catch (error) {
        results.push({
          index: i,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return {
      total: dto.records.length,
      succeeded: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      results,
    };
  }

  // ─── Media ────────────────────────────────────────────────────────────────

  async addMedia(tenantId: string, weighingId: string, media: Partial<WeighingMedia>): Promise<WeighingMedia> {
    const weighing = await this.weighingRepo.findOne({
      where: { id: weighingId, idTenant: tenantId },
    });
    if (!weighing) throw new NotFoundException(`Weighing not found: ${weighingId}`);

    const record = this.mediaRepo.create({
      ...media,
      idTenant: tenantId,
      weighingId,
    });
    return this.mediaRepo.save(record);
  }

  // ─── EID Lookup ───────────────────────────────────────────────────────────

  async findCattleByEid(tenantId: string, eid: string): Promise<Cattle | null> {
    // Search by EID in eid_tag field, eartag_left, or eartag_right
    const cattle = await this.cattleRepo
      .createQueryBuilder('cattle')
      .where('cattle.id_tenant = :tenantId', { tenantId })
      .andWhere(
        '(cattle.eid_tag = :eid OR cattle.eartag_left = :eid OR cattle.eartag_right = :eid)',
        { eid },
      )
      .getOne();
    return cattle;
  }

  // ─── Bridge Devices ───────────────────────────────────────────────────────

  async registerDevice(tenantId: string, dto: RegisterDeviceDto): Promise<BridgeDevice> {
    const apiKey = crypto.randomBytes(32).toString('hex');
    const device = this.deviceRepo.create({
      idTenant: tenantId,
      name: dto.name,
      type: dto.type,
      ipAddress: dto.ipAddress || null,
      configJson: dto.configJson || {},
      apiKey,
      status: BridgeDeviceStatus.OFFLINE,
    });
    return this.deviceRepo.save(device);
  }

  async listDevices(tenantId: string): Promise<BridgeDevice[]> {
    return this.deviceRepo.find({ where: { idTenant: tenantId } });
  }

  async deviceHeartbeat(deviceId: string, apiKey: string): Promise<{ status: string; pollIntervalMs: number }> {
    const device = await this.deviceRepo.findOne({ where: { id: deviceId } });
    if (!device || device.apiKey !== apiKey) {
      throw new BadRequestException('Invalid device or API key');
    }

    device.status = BridgeDeviceStatus.ONLINE;
    device.lastSeenAt = new Date();
    await this.deviceRepo.save(device);

    return {
      status: 'ok',
      pollIntervalMs: 30000,
    };
  }

  async revokeDevice(tenantId: string, deviceId: string): Promise<void> {
    const device = await this.deviceRepo.findOne({
      where: { id: deviceId, idTenant: tenantId },
    });
    if (!device) throw new NotFoundException(`Device not found: ${deviceId}`);
    await this.deviceRepo.remove(device);
  }
}

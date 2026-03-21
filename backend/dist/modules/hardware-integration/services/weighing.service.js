"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeighingService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const weighing_entity_1 = require("../entities/weighing.entity");
const weighing_media_entity_1 = require("../entities/weighing-media.entity");
const weighing_audit_log_entity_1 = require("../entities/weighing-audit-log.entity");
const bridge_device_entity_1 = require("../entities/bridge-device.entity");
const weighing_source_enum_1 = require("../enums/weighing-source.enum");
const cattle_entity_1 = require("../../farm/entities/cattle.entity");
const cattle_weight_history_entity_1 = require("../../farm/entities/cattle-weight-history.entity");
const crypto = require("crypto");
let WeighingService = class WeighingService {
    constructor(weighingRepo, mediaRepo, auditLogRepo, deviceRepo, cattleRepo, weightHistoryRepo, dataSource) {
        this.weighingRepo = weighingRepo;
        this.mediaRepo = mediaRepo;
        this.auditLogRepo = auditLogRepo;
        this.deviceRepo = deviceRepo;
        this.cattleRepo = cattleRepo;
        this.weightHistoryRepo = weightHistoryRepo;
        this.dataSource = dataSource;
    }
    async createWeighing(tenantId, dto, userId) {
        const cattle = await this.cattleRepo.findOne({
            where: { id: dto.idCattle, idTenant: tenantId },
        });
        if (!cattle)
            throw new common_1.NotFoundException(`Cattle not found: ${dto.idCattle}`);
        return this.dataSource.transaction(async (manager) => {
            const weighing = manager.create(weighing_entity_1.Weighing, {
                idTenant: tenantId,
                idCattle: dto.idCattle,
                eidTag: dto.eidTag || null,
                grossWeightKg: dto.grossWeightKg,
                netWeightKg: dto.netWeightKg || null,
                tareKg: dto.tareKg || null,
                stableAt: dto.stableAt ? new Date(dto.stableAt) : null,
                operatorId: dto.operatorId || userId || null,
                source: dto.source || weighing_source_enum_1.WeighingSource.MANUAL,
                bridgeDeviceId: dto.bridgeDeviceId || null,
                notes: dto.notes || null,
            });
            const saved = await manager.save(weighing_entity_1.Weighing, weighing);
            const effectiveWeight = dto.netWeightKg || dto.grossWeightKg;
            await manager.update(cattle_entity_1.Cattle, { id: dto.idCattle }, { lastWeight: effectiveWeight });
            const history = manager.create(cattle_weight_history_entity_1.CattleWeightHistory, {
                idTenant: tenantId,
                idCattle: dto.idCattle,
                weight: effectiveWeight,
                date: new Date(),
                context: dto.source === weighing_source_enum_1.WeighingSource.AUTOMATIC ? cattle_weight_history_entity_1.WeightContext.EVENT : cattle_weight_history_entity_1.WeightContext.MANUAL,
                recordedBy: dto.operatorId || userId || null,
            });
            await manager.save(cattle_weight_history_entity_1.CattleWeightHistory, history);
            return saved;
        });
    }
    async getWeighing(tenantId, id) {
        const weighing = await this.weighingRepo.findOne({
            where: { id, idTenant: tenantId },
            relations: ['cattle', 'media'],
        });
        if (!weighing)
            throw new common_1.NotFoundException(`Weighing not found: ${id}`);
        return weighing;
    }
    async listWeighings(tenantId, query) {
        const where = { idTenant: tenantId };
        if (query.idCattle)
            where.idCattle = query.idCattle;
        if (query.operatorId)
            where.operatorId = query.operatorId;
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
    async updateWeighing(tenantId, id, dto, userId) {
        const weighing = await this.weighingRepo.findOne({
            where: { id, idTenant: tenantId },
        });
        if (!weighing)
            throw new common_1.NotFoundException(`Weighing not found: ${id}`);
        const auditLogs = [];
        for (const [key, newValue] of Object.entries(dto)) {
            if (newValue !== undefined && newValue !== weighing[key]) {
                auditLogs.push({
                    idTenant: tenantId,
                    weighingId: id,
                    fieldChanged: key,
                    oldValue: String(weighing[key]),
                    newValue: String(newValue),
                    changedBy: userId,
                });
            }
        }
        return this.dataSource.transaction(async (manager) => {
            if (auditLogs.length > 0) {
                await manager.save(weighing_audit_log_entity_1.WeighingAuditLog, auditLogs);
            }
            Object.assign(weighing, dto);
            const updated = await manager.save(weighing_entity_1.Weighing, weighing);
            if (dto.grossWeightKg || dto.netWeightKg) {
                const effectiveWeight = dto.netWeightKg || dto.grossWeightKg || weighing.netWeightKg || weighing.grossWeightKg;
                await manager.update(cattle_entity_1.Cattle, { id: weighing.idCattle }, { lastWeight: effectiveWeight });
            }
            return updated;
        });
    }
    async batchSync(tenantId, dto, userId) {
        const results = [];
        for (let i = 0; i < dto.records.length; i++) {
            try {
                const weighing = await this.createWeighing(tenantId, dto.records[i], userId);
                results.push({ index: i, success: true, id: weighing.id });
            }
            catch (error) {
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
    async addMedia(tenantId, weighingId, media) {
        const weighing = await this.weighingRepo.findOne({
            where: { id: weighingId, idTenant: tenantId },
        });
        if (!weighing)
            throw new common_1.NotFoundException(`Weighing not found: ${weighingId}`);
        const record = this.mediaRepo.create({
            ...media,
            idTenant: tenantId,
            weighingId,
        });
        return this.mediaRepo.save(record);
    }
    async findCattleByEid(tenantId, eid) {
        const cattle = await this.cattleRepo
            .createQueryBuilder('cattle')
            .where('cattle.id_tenant = :tenantId', { tenantId })
            .andWhere('(cattle.eid_tag = :eid OR cattle.eartag_left = :eid OR cattle.eartag_right = :eid)', { eid })
            .getOne();
        return cattle;
    }
    async registerDevice(tenantId, dto) {
        const apiKey = crypto.randomBytes(32).toString('hex');
        const device = this.deviceRepo.create({
            idTenant: tenantId,
            name: dto.name,
            type: dto.type,
            ipAddress: dto.ipAddress || null,
            configJson: dto.configJson || {},
            apiKey,
            status: weighing_source_enum_1.BridgeDeviceStatus.OFFLINE,
        });
        return this.deviceRepo.save(device);
    }
    async listDevices(tenantId) {
        return this.deviceRepo.find({ where: { idTenant: tenantId } });
    }
    async deviceHeartbeat(deviceId, apiKey) {
        const device = await this.deviceRepo.findOne({ where: { id: deviceId } });
        if (!device || device.apiKey !== apiKey) {
            throw new common_1.BadRequestException('Invalid device or API key');
        }
        device.status = weighing_source_enum_1.BridgeDeviceStatus.ONLINE;
        device.lastSeenAt = new Date();
        await this.deviceRepo.save(device);
        return {
            status: 'ok',
            pollIntervalMs: 30000,
        };
    }
    async revokeDevice(tenantId, deviceId) {
        const device = await this.deviceRepo.findOne({
            where: { id: deviceId, idTenant: tenantId },
        });
        if (!device)
            throw new common_1.NotFoundException(`Device not found: ${deviceId}`);
        await this.deviceRepo.remove(device);
    }
};
exports.WeighingService = WeighingService;
exports.WeighingService = WeighingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(weighing_entity_1.Weighing)),
    __param(1, (0, typeorm_1.InjectRepository)(weighing_media_entity_1.WeighingMedia)),
    __param(2, (0, typeorm_1.InjectRepository)(weighing_audit_log_entity_1.WeighingAuditLog)),
    __param(3, (0, typeorm_1.InjectRepository)(bridge_device_entity_1.BridgeDevice)),
    __param(4, (0, typeorm_1.InjectRepository)(cattle_entity_1.Cattle)),
    __param(5, (0, typeorm_1.InjectRepository)(cattle_weight_history_entity_1.CattleWeightHistory)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource])
], WeighingService);
//# sourceMappingURL=weighing.service.js.map
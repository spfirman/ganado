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
exports.CattleDeviceHistoryRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const cattle_device_history_entity_1 = require("../entities/cattle-device-history.entity");
let CattleDeviceHistoryRepository = class CattleDeviceHistoryRepository {
    constructor(repo) {
        this.repo = repo;
    }
    async create(entity) {
        return await this.repo.save(entity);
    }
    async createWithManager(manager, entity) {
        return await manager.save(cattle_device_history_entity_1.CattleDeviceHistory, entity);
    }
    async findByCattle(idTenant, idCattle) {
        return await this.repo.find({
            where: {
                idTenant,
                idCattle,
            },
            order: { assignedAt: 'DESC' },
        });
    }
    async findOneById(idTenant, id) {
        return await this.repo.findOne({
            where: { idTenant, id },
        });
    }
    async update(entity) {
        return await this.repo.save(entity);
    }
    async updateWithManager(manager, entity) {
        return await manager.save(cattle_device_history_entity_1.CattleDeviceHistory, entity);
    }
    async deleteById(idTenant, id) {
        await this.repo.delete({ idTenant, id });
    }
    async deleteByIdWithManager(idTenant, id, manager) {
        await manager.delete(cattle_device_history_entity_1.CattleDeviceHistory, { idTenant, id });
    }
    async assignDeviceToCattle(idDevice, idCattle, idTenant, assignedBy, assignedAt, idMassiveEvent, manager) {
        const repo = manager?.getRepository(cattle_device_history_entity_1.CattleDeviceHistory) ?? this.repo;
        const activeAssignment = await repo.findOne({
            where: { idDevice, idTenant, unassignedAt: (0, typeorm_2.IsNull)() },
        });
        if (activeAssignment) {
            if (activeAssignment.idCattle === idCattle) {
                return activeAssignment;
            }
            throw new common_1.BadRequestException('Este device ya está asignado a otro cattle.');
        }
        const newAssignment = repo.create({
            idCattle,
            idDevice,
            idTenant,
            assignedBy: assignedBy ?? undefined,
            idMassiveEvent: idMassiveEvent ?? undefined,
            assignedAt: assignedAt ?? new Date(),
        });
        await repo.save(newAssignment);
        return newAssignment;
    }
    async unassignDeviceByidDevice(idTenant, idDevice, manager, unassignedAt) {
        const repo = manager?.getRepository(cattle_device_history_entity_1.CattleDeviceHistory) ?? this.repo;
        const current = await repo.findOne({
            where: { idDevice, idTenant, unassignedAt: (0, typeorm_2.IsNull)() },
        });
        if (current) {
            current.unassignedAt = unassignedAt ?? new Date();
            await repo.save(current);
        }
    }
    async unassignDeviceByidCattle(idTenant, idCattle, manager, unassignedAt) {
        const repo = manager?.getRepository(cattle_device_history_entity_1.CattleDeviceHistory) ?? this.repo;
        const current = await repo.findOne({
            where: { idCattle, idTenant, unassignedAt: (0, typeorm_2.IsNull)() },
        });
        if (current) {
            current.unassignedAt = unassignedAt ?? new Date();
            await repo.save(current);
        }
    }
};
exports.CattleDeviceHistoryRepository = CattleDeviceHistoryRepository;
exports.CattleDeviceHistoryRepository = CattleDeviceHistoryRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(cattle_device_history_entity_1.CattleDeviceHistory)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CattleDeviceHistoryRepository);
//# sourceMappingURL=cattle-device-history.repository.js.map
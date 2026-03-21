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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleEventService = void 0;
const common_1 = require("@nestjs/common");
const simple_event_repository_1 = require("../repositories/simple-event.repository");
const typeorm_1 = require("typeorm");
const simple_event_entity_1 = require("../entities/simple-event.entity");
const uuid_1 = require("uuid");
const massive_event_service_1 = require("./massive-event.service");
let SimpleEventService = class SimpleEventService {
    constructor(dataSource, simpleEventRepo, massiveEventSevice) {
        this.dataSource = dataSource;
        this.simpleEventRepo = simpleEventRepo;
        this.massiveEventSevice = massiveEventSevice;
    }
    async createSimpleEvent12(idTenant, dto) {
        await this.massiveEventSevice.findByIdOrFail(idTenant, dto.idMassiveEvent);
        const typesWithData = ['brand', 'medication'];
        if (typesWithData.includes(dto.type)) {
            if (!dto.data) {
                throw new common_1.BadRequestException(`Data is required for type ${dto.type}`);
            }
        }
        else {
            if (dto.data) {
                throw new common_1.BadRequestException(`Data is not allowed for type ${dto.type}`);
            }
        }
        const simpleEvent = this.simpleEventRepo.createInstance({
            idMassiveEvent: dto.idMassiveEvent,
            type: dto.type,
            data: dto.data ?? null,
        });
        return this.simpleEventRepo.save(simpleEvent);
    }
    async saveNewSimpleEvent(manager, payload) {
        const exists = await manager.findOne(simple_event_entity_1.SimpleEvent, { where: { id: payload.id } });
        if (exists)
            return exists;
        if (payload.idMassiveEvent == null || payload.idMassiveEvent.trim() === '') {
            throw new common_1.BadRequestException('idMassiveEvent is required');
        }
        this.validateDataFields(payload.type, payload.dataJson);
        const simpleEvent = this.simpleEventRepo.createInstance({
            id: payload.id,
            idMassiveEvent: payload.idMassiveEvent,
            idTenant: payload.idTenant,
            type: payload.type,
            data: payload.dataJson ? JSON.parse(payload.dataJson) : null,
            createdAt: payload.createdAt ? new Date(payload.createdAt) : new Date(),
        });
        return this.simpleEventRepo.saveWithManager(manager, simpleEvent);
    }
    async createSimpleEvent(idTenant, dto) {
        await this.massiveEventSevice.findByIdOrFail(idTenant, dto.idMassiveEvent);
        return this.dataSource.transaction((manager) => this.saveNewSimpleEvent(manager, {
            id: (0, uuid_1.v4)(),
            idMassiveEvent: dto.idMassiveEvent,
            idTenant,
            type: dto.type,
            dataJson: dto.data ? JSON.stringify(dto.data) : undefined,
        }));
    }
    async syncSimpleEvents(idTenant, dtos) {
        return this.dataSource.transaction(async (manager) => {
            const results = [];
            for (const dto of dtos) {
                let massiveEvent;
                try {
                    massiveEvent = await this.massiveEventSevice.findByIdOrFail(idTenant, dto.massiveEventServerId);
                }
                catch (error) {
                    results.push({ id: dto.id, status: 'failed', serverId: '', message: 'MassiveEvent not found' });
                    continue;
                }
                const saved = await this.saveNewSimpleEvent(manager, {
                    id: dto.id,
                    idMassiveEvent: massiveEvent.id,
                    idTenant,
                    type: dto.type,
                    dataJson: dto.dataJson,
                    createdAt: dto.createdAt,
                });
                results.push({ id: saved.id, status: 'synced', serverId: saved.id });
            }
            return results;
        });
    }
    async findByIdOrFail(idTenant, id, manager) {
        const simpleEvent = await this.simpleEventRepo.findById(idTenant, id, manager);
        if (!simpleEvent)
            throw new common_1.NotFoundException(`SimpleEvent ${id} not found`);
        return simpleEvent;
    }
    async findByMassiveEvent(idTenant, idMassiveEvent) {
        return this.simpleEventRepo.findByMassiveEvent(idTenant, idMassiveEvent);
    }
    async delete(id) {
        return this.simpleEventRepo.deleteById(id);
    }
    async deleteByMassiveEvent(manager, idMassiveEvent) {
        return this.simpleEventRepo.deleteByMassiveEvent(manager, idMassiveEvent);
    }
    validateDataFields(type, dataInput) {
        if (type == 'eartag') {
            let data;
            if (typeof dataInput === 'string') {
                if (dataInput.trim() === '') {
                    throw new common_1.BadRequestException('dataJson is required for type eartag');
                }
                data = JSON.parse(dataInput);
            }
            else if (dataInput && typeof dataInput === 'object') {
                data = dataInput;
            }
            else {
                throw new common_1.BadRequestException('data is required for type eartag');
            }
            const left = typeof data.eartagLeft === 'string' ? data.eartagLeft.trim() : '';
            const right = typeof data.eartagRight === 'string' ? data.eartagRight.trim() : '';
            if (left.length === 0 && right.length === 0) {
                throw new common_1.BadRequestException('dataJson is invalid for type eartag');
            }
        }
        if (type == 'medication') {
            let data;
            if (typeof dataInput === 'string') {
                if (dataInput.trim() === '') {
                    throw new common_1.BadRequestException('dataJson is required for type medication');
                }
                data = JSON.parse(dataInput);
            }
            else if (dataInput && typeof dataInput === 'object') {
                data = dataInput;
            }
            else {
                throw new common_1.BadRequestException('data is required for type medication');
            }
            const requiredKeys = ['medicationName', 'dosage', 'lot'];
            const dataKeys = Object.keys(data);
            const hasAllKeys = requiredKeys.every((k) => dataKeys.includes(k));
            if (!hasAllKeys) {
                throw new common_1.BadRequestException('dataJson is invalid for type medication');
            }
            var isValid = requiredKeys.every((key) => typeof data[key] === 'string' && data[key].trim().length > 0);
            if (!isValid) {
                throw new common_1.BadRequestException('dataJson is invalid for type medication');
            }
        }
    }
    async updateSimpleEvent(idTenant, id, dto) {
        return this.dataSource.transaction(async (manager) => {
            const simpleEvent = await this.findByIdOrFail(idTenant, id, manager);
            this.validateDataFields(simpleEvent.type, dto.data);
            return this.simpleEventRepo.updateSimpleEvent(id, dto, manager);
        });
    }
    findByIds(idTenant, ids, manager) {
        return this.simpleEventRepo.findByIds(idTenant, ids, manager);
    }
};
exports.SimpleEventService = SimpleEventService;
exports.SimpleEventService = SimpleEventService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource,
        simple_event_repository_1.SimpleEventRepository,
        massive_event_service_1.MassiveEventService])
], SimpleEventService);
//# sourceMappingURL=simple-event.service.js.map
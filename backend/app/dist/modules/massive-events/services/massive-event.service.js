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
var MassiveEventService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MassiveEventService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const massive_event_repository_1 = require("../repositories/massive-event.repository");
const simple_event_repository_1 = require("../repositories/simple-event.repository");
const animal_simple_event_repository_1 = require("../repositories/animal-simple-event.repository");
const cattle_repository_1 = require("../../farm/repositories/cattle.repository");
const simple_event_entity_1 = require("../entities/simple-event.entity");
const massive_events_entity_1 = require("../entities/massive-events.entity");
const uuid_1 = require("uuid");
let MassiveEventService = MassiveEventService_1 = class MassiveEventService {
    dataSource;
    massiveEventRepo;
    simpleEventRepo;
    simpleEventCattleRepository;
    cattleRepository;
    logger = new common_1.Logger(MassiveEventService_1.name);
    constructor(dataSource, massiveEventRepo, simpleEventRepo, simpleEventCattleRepository, cattleRepository) {
        this.dataSource = dataSource;
        this.massiveEventRepo = massiveEventRepo;
        this.simpleEventRepo = simpleEventRepo;
        this.simpleEventCattleRepository = simpleEventCattleRepository;
        this.cattleRepository = cattleRepository;
    }
    async saveMassiveAndSimples(manager, payload) {
        let massiveEvent = await manager.findOne(massive_events_entity_1.MassiveEvent, {
            where: { id: payload.id, idTenant: payload.idTenant },
        });
        if (!massiveEvent) {
            massiveEvent = this.massiveEventRepo.createInstance({
                id: payload.id,
                idTenant: payload.idTenant,
                eventDate: new Date(payload.eventDate),
                status: payload.status,
                createdBy: payload.createdBy,
                createdAt: payload.createdAt ? new Date(payload.createdAt) : undefined,
                updatedAt: payload.updatedAt ? new Date(payload.updatedAt) : undefined,
            });
            await this.massiveEventRepo.saveWithManager(manager, massiveEvent);
        }
        var simpleEvents = [];
        if (payload.simpleEvents?.length) {
            for (const se of payload.simpleEvents) {
                const exists = await manager.findOne(simple_event_entity_1.SimpleEvent, { where: { id: se.id } });
                if (!exists) {
                    const simpleEvent = this.simpleEventRepo.createInstance({
                        id: se.id,
                        idMassiveEvent: massiveEvent.id,
                        idTenant: payload.idTenant,
                        type: se.type,
                        data: se.dataJson ? JSON.parse(se.dataJson) : null,
                        createdAt: se.createdAt ? new Date(se.createdAt) : undefined,
                    });
                    const simEv = await this.simpleEventRepo.saveWithManager(manager, simpleEvent);
                    simpleEvents.push(simEv);
                }
                else {
                    simpleEvents.push(exists);
                }
            }
        }
        massiveEvent.simpleEvents = simpleEvents;
        return massiveEvent;
    }
    async createMassiveEvent(idTenant, createdBy, dto) {
        return this.dataSource.transaction(async (manager) => {
            const payload = {
                id: (0, uuid_1.v4)(),
                idTenant,
                eventDate: dto.eventDate,
                status: 'open',
                createdBy,
                simpleEvents: dto.simpleEvents?.map(se => ({
                    id: (0, uuid_1.v4)(),
                    type: se.type,
                    dataJson: se.data ? JSON.stringify(se.data) : undefined,
                })),
            };
            const massiveEvent = await this.saveMassiveAndSimples(manager, payload);
            return massiveEvent;
        });
    }
    async syncMassiveEvents(idTenant, dtos) {
        return this.dataSource.transaction(async (manager) => {
            const results = [];
            for (const dto of dtos) {
                const saved = await this.saveMassiveAndSimples(manager, { ...dto, idTenant });
                results.push({ id: saved.id, status: 'synced' });
            }
            return results;
        });
    }
    async createMassiveEvent1(idTenant, createdBy, dto) {
        return this.dataSource.transaction(async (manager) => {
            const massiveEvent = this.massiveEventRepo.createInstance({
                id: (0, uuid_1.v4)(),
                idTenant,
                eventDate: new Date(dto.eventDate),
                status: 'open',
                createdBy,
            });
            await this.massiveEventRepo.saveWithManager(manager, massiveEvent);
            const createdSimpleEvents = [];
            if (dto.simpleEvents && dto.simpleEvents.length > 0) {
                for (const se of dto.simpleEvents) {
                    const simpleEvent = this.simpleEventRepo.createInstance({
                        idMassiveEvent: massiveEvent.id,
                        type: se.type,
                        data: se.data ?? null,
                    });
                    createdSimpleEvents.push(await this.simpleEventRepo.saveWithManager(manager, simpleEvent));
                }
            }
            massiveEvent.simpleEvents = createdSimpleEvents;
            return massiveEvent;
        });
    }
    async findByIdOrFail(idTenant, idMassiveEvent, manager) {
        const massiveEvent = await this.massiveEventRepo.findById(idTenant, idMassiveEvent, manager);
        if (!massiveEvent)
            throw new common_1.NotFoundException(`MassiveEvent ${idMassiveEvent} not found`);
        return massiveEvent;
    }
    async findWithSimpleEventsByIdOrFail(idTenant, idMassiveEvent, manager) {
        const massiveEvent = await this.massiveEventRepo.findOneWithSimpleEvents(idTenant, idMassiveEvent, manager);
        if (!massiveEvent)
            throw new common_1.NotFoundException(`MassiveEvent ${idMassiveEvent} not found`);
        return massiveEvent;
    }
    async findCattleByMassiveEvent(idTenant, idMassiveEvent) {
        const simpleEvents = await this.simpleEventRepo.findByMassiveEvent(idTenant, idMassiveEvent);
        const simpleEventIds = simpleEvents.map(ev => ev.id);
        if (simpleEventIds.length === 0) {
            return [];
        }
        const links = await this.simpleEventCattleRepository.findBySimpleEvents(idTenant, simpleEventIds);
        const cattleIds = links.map(link => link.idAnimal).filter(Boolean);
        const cattleList = await this.cattleRepository.findByIds(idTenant, cattleIds);
        return cattleList.map(cattle => {
            return {
                id: cattle.id,
                number: cattle.number,
                idBrand: cattle.idBrand,
                lastWeight: cattle.lastWeight,
                appliedAt: links.find(l => l.idAnimal === cattle.id)?.appliedAt,
            };
        });
    }
    async findAll(idTenant) {
        return this.massiveEventRepo.findAllByTenant(idTenant);
    }
    async closeMassiveEvent(idTenant, id) {
        await this.dataSource.transaction(async (manager) => {
            const massiveEvent = await this.findByIdOrFail(idTenant, id, manager);
            await this.simpleEventRepo.deleteUnappliedByMassiveEvent(manager, idTenant, id);
            const simpleEvents = await this.simpleEventRepo.findByMassiveEvent(idTenant, id);
            if (simpleEvents.length === 0) {
                throw new common_1.HttpException('No simple events applied', common_1.HttpStatus.UNPROCESSABLE_ENTITY);
            }
            await this.massiveEventRepo.updateByIdWithManager(manager, id, idTenant, { status: 'closed' });
        });
    }
    async deleteMassiveEvent(idTenant, id) {
        await this.dataSource.transaction(async (manager) => {
            const event = await this.findByIdOrFail(idTenant, id, manager);
            await this.simpleEventRepo.deleteByMassiveEvent(manager, id);
            await this.massiveEventRepo.deleteByIdWithManager(manager, id, idTenant);
        });
    }
};
exports.MassiveEventService = MassiveEventService;
exports.MassiveEventService = MassiveEventService = MassiveEventService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource,
        massive_event_repository_1.MassiveEventRepository,
        simple_event_repository_1.SimpleEventRepository,
        animal_simple_event_repository_1.AnimalSimpleEventRepository,
        cattle_repository_1.CattleRepository])
], MassiveEventService);
//# sourceMappingURL=massive-event.service.js.map
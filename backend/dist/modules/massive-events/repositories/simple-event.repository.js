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
var SimpleEventRepository_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleEventRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const simple_event_entity_1 = require("../entities/simple-event.entity");
const animal_simple_event_entity_1 = require("../entities/animal-simple-event.entity");
const typeorm_2 = require("typeorm");
let SimpleEventRepository = SimpleEventRepository_1 = class SimpleEventRepository {
    dataSource;
    logger = new common_1.Logger(SimpleEventRepository_1.name);
    repository;
    constructor(dataSource) {
        this.dataSource = dataSource;
        this.repository = this.dataSource.getRepository(simple_event_entity_1.SimpleEvent);
    }
    createInstance(data) {
        return this.repository.create(data);
    }
    async save(entity) {
        return this.repository.save(entity);
    }
    async saveWithManager(manager, entity) {
        return manager.save(simple_event_entity_1.SimpleEvent, entity);
    }
    async findById(idTenant, id, manager) {
        const repo = manager?.getRepository(simple_event_entity_1.SimpleEvent) ?? this.repository;
        return await repo.findOne({ where: { idTenant, id } });
    }
    async findByMassiveEvent(idTenant, idMassiveEvent, manager) {
        const repo = manager?.getRepository(simple_event_entity_1.SimpleEvent) ?? this.repository;
        return repo.find({ where: { idTenant, idMassiveEvent } });
    }
    async deleteById(id) {
        await this.repository.delete({ id });
    }
    async deleteByIdWithManager(manager, id) {
        await manager.delete(simple_event_entity_1.SimpleEvent, { id });
    }
    async deleteByMassiveEvent(manager, idMassiveEvent) {
        await manager.delete(simple_event_entity_1.SimpleEvent, { idMassiveEvent });
    }
    async deleteUnappliedByMassiveEvent(manager, idTenant, idMassiveEvent) {
        const sub = manager
            .createQueryBuilder()
            .select('se.id')
            .from(simple_event_entity_1.SimpleEvent, 'se')
            .where('se.idTenant = :idTenant', { idTenant })
            .andWhere('se.idMassiveEvent = :idMassiveEvent', { idMassiveEvent })
            .andWhere(() => {
            const notExists = manager
                .createQueryBuilder()
                .subQuery()
                .select('1')
                .from(animal_simple_event_entity_1.AnimalSimpleEvent, 'ase')
                .where('ase.idSimpleEvent = se.id')
                .andWhere('ase.idTenant = se.idTenant')
                .getQuery();
            return `NOT EXISTS (${notExists})`;
        });
        const res = await manager
            .createQueryBuilder()
            .delete()
            .from(simple_event_entity_1.SimpleEvent)
            .where(`id IN (${sub.getQuery()})`)
            .setParameters(sub.getParameters())
            .execute();
        return res.affected ?? 0;
    }
    findByIds(idTenant, ids, manager) {
        const repo = manager?.getRepository(simple_event_entity_1.SimpleEvent) ?? this.repository;
        return repo.find({ where: { idTenant, id: (0, typeorm_2.In)(ids) } });
    }
    updateSimpleEvent(id, dto, manager) {
        return manager.save(simple_event_entity_1.SimpleEvent, {
            id,
            data: dto.data,
            isActive: dto.isActive,
        });
    }
};
exports.SimpleEventRepository = SimpleEventRepository;
exports.SimpleEventRepository = SimpleEventRepository = SimpleEventRepository_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], SimpleEventRepository);
//# sourceMappingURL=simple-event.repository.js.map
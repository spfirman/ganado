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
var MassiveEventRepository_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MassiveEventRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const massive_events_entity_1 = require("../entities/massive-events.entity");
let MassiveEventRepository = MassiveEventRepository_1 = class MassiveEventRepository {
    constructor(dataSource) {
        this.dataSource = dataSource;
        this.logger = new common_1.Logger(MassiveEventRepository_1.name);
        this.repository = this.dataSource.getRepository(massive_events_entity_1.MassiveEvent);
    }
    createInstance(data) {
        return this.repository.create(data);
    }
    async save(entity) {
        return this.repository.save(entity);
    }
    async saveWithManager(manager, entity) {
        return manager.save(massive_events_entity_1.MassiveEvent, entity);
    }
    async updateByIdWithManager(manager, id, idTenant, data) {
        await manager.update(massive_events_entity_1.MassiveEvent, { id, idTenant }, data);
    }
    async findById(idTenant, id, manager) {
        const repo = manager?.getRepository(massive_events_entity_1.MassiveEvent) ?? this.repository;
        return await repo.findOne({ where: { id, idTenant } });
    }
    async findOneWithSimpleEvents(idTenant, idMassiveEvent, manager) {
        const repo = manager?.getRepository(massive_events_entity_1.MassiveEvent) ?? this.repository;
        return await repo.findOne({
            where: { idTenant, id: idMassiveEvent },
            relations: ['simpleEvents'],
        });
    }
    async findAllByTenant(idTenant) {
        return this.repository.find({ where: { idTenant } });
    }
    async deleteById(id, idTenant) {
        await this.repository.delete({ id, idTenant });
    }
    async deleteByIdWithManager(manager, id, idTenant) {
        await manager.delete(massive_events_entity_1.MassiveEvent, { id, idTenant });
    }
};
exports.MassiveEventRepository = MassiveEventRepository;
exports.MassiveEventRepository = MassiveEventRepository = MassiveEventRepository_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], MassiveEventRepository);
//# sourceMappingURL=massive-event.repository.js.map
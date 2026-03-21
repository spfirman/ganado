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
var AnimalSimpleEventRepository_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnimalSimpleEventRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const animal_simple_event_entity_1 = require("../entities/animal-simple-event.entity");
let AnimalSimpleEventRepository = AnimalSimpleEventRepository_1 = class AnimalSimpleEventRepository {
    constructor(dataSource) {
        this.dataSource = dataSource;
        this.logger = new common_1.Logger(AnimalSimpleEventRepository_1.name);
        this.repository = this.dataSource.getRepository(animal_simple_event_entity_1.AnimalSimpleEvent);
    }
    createInstance(data) {
        return this.repository.create(data);
    }
    async saveAnimalSimpleEvent(entity) {
        return this.repository.save(entity);
    }
    async saveWithManager(manager, entity) {
        return manager.save(animal_simple_event_entity_1.AnimalSimpleEvent, entity);
    }
    async findById(idTenant, id) {
        return this.repository.findOne({ where: { idTenant, id } });
    }
    async findByCattle(idTenant, idCattle, manager) {
        const repo = manager?.getRepository(animal_simple_event_entity_1.AnimalSimpleEvent) ?? this.repository;
        return repo.find({ where: { idTenant, idAnimal: idCattle } });
    }
    async findBySimpleEvent(idSimpleEvent) {
        return this.repository.find({ where: { idSimpleEvent } });
    }
    async findBySimpleEvents(idTenant, simpleEventIds) {
        return this.repository.find({ where: { idTenant, idSimpleEvent: (0, typeorm_1.In)(simpleEventIds) } });
    }
    async deleteById(idTenant, id) {
        await this.repository.delete({ idTenant, id });
    }
    async deleteByIdWithManager(manager, idTenant, id) {
        await manager.delete(animal_simple_event_entity_1.AnimalSimpleEvent, { idTenant, id });
    }
    async insertMany(rows, manager) {
        if (!rows?.length)
            return;
        const m = manager ?? this.dataSource.manager;
        await m
            .createQueryBuilder()
            .insert()
            .into(animal_simple_event_entity_1.AnimalSimpleEvent)
            .values(rows)
            .orIgnore()
            .execute();
    }
};
exports.AnimalSimpleEventRepository = AnimalSimpleEventRepository;
exports.AnimalSimpleEventRepository = AnimalSimpleEventRepository = AnimalSimpleEventRepository_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], AnimalSimpleEventRepository);
//# sourceMappingURL=animal-simple-event.repository.js.map
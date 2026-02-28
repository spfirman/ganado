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
exports.CattleMedicationHistoryRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const cattle_medication_history_entity_1 = require("../entities/cattle-medication-history.entity");
let CattleMedicationHistoryRepository = class CattleMedicationHistoryRepository {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async create(entity) {
        return await this.repo.save(entity);
    }
    async createWithManager(manager, entity) {
        return await manager.save(cattle_medication_history_entity_1.CattleMedicationHistory, entity);
    }
    async findByCattle(idTenant, idCattle, manager) {
        var repo = this.repo;
        if (manager) {
            repo = manager.getRepository(cattle_medication_history_entity_1.CattleMedicationHistory);
        }
        return await repo.find({
            where: { idTenant, idCattle },
            order: { appliedAt: 'DESC' },
        });
    }
    async findOneById(idTenant, id) {
        return await this.repo.findOne({ where: { idTenant, id } });
    }
    async update(entity) {
        return await this.repo.save(entity);
    }
    async updateWithManager(manager, entity) {
        return await manager.save(cattle_medication_history_entity_1.CattleMedicationHistory, entity);
    }
    async deleteById(idTenant, id) {
        await this.repo.delete({ idTenant, id });
    }
    async deleteByIdWithManager(idTenant, id, manager) {
        await manager.delete(cattle_medication_history_entity_1.CattleMedicationHistory, { idTenant, id });
    }
};
exports.CattleMedicationHistoryRepository = CattleMedicationHistoryRepository;
exports.CattleMedicationHistoryRepository = CattleMedicationHistoryRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(cattle_medication_history_entity_1.CattleMedicationHistory)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CattleMedicationHistoryRepository);
//# sourceMappingURL=cattle-medication-history.repository.js.map
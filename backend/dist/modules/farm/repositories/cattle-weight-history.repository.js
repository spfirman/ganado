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
var CattleWeightHistoryRepository_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CattleWeightHistoryRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const cattle_weight_history_entity_1 = require("../entities/cattle-weight-history.entity");
let CattleWeightHistoryRepository = CattleWeightHistoryRepository_1 = class CattleWeightHistoryRepository {
    constructor(repo) {
        this.repo = repo;
        this.logger = new common_1.Logger(CattleWeightHistoryRepository_1.name);
    }
    async create(entity, manager) {
        var repo = this.repo;
        if (manager) {
            repo = manager.getRepository(cattle_weight_history_entity_1.CattleWeightHistory);
        }
        return await repo.save(entity);
    }
    async createWithManager(manager, entity) {
        this.logger.debug('GUARDAR HISTORIA DE PESO');
        this.logger.debug(entity);
        return await manager.save(cattle_weight_history_entity_1.CattleWeightHistory, entity);
    }
    async findByCattle(idTenant, idCattle, manager, context) {
        var repo = this.repo;
        if (manager) {
            repo = manager.getRepository(cattle_weight_history_entity_1.CattleWeightHistory);
        }
        if (!context) {
            return await repo.find({
                where: { idTenant, idCattle },
                order: { date: 'ASC' },
            });
        }
        else {
            return await repo.find({
                where: { idTenant, idCattle, context },
                order: { date: 'ASC' },
            });
        }
    }
    async findLastByCattle(idTenant, idCattle, manager) {
        const repo = manager
            ? manager.getRepository(cattle_weight_history_entity_1.CattleWeightHistory)
            : this.repo;
        const list = await repo.find({
            where: { idTenant, idCattle },
            order: { date: 'DESC' },
            take: 1,
        });
        return list[0] ?? null;
    }
    async findOneById(idTenant, id) {
        return await this.repo.findOne({ where: { idTenant, id } });
    }
    async update(entity, manager) {
        var repo = this.repo;
        if (manager) {
            repo = manager.getRepository(cattle_weight_history_entity_1.CattleWeightHistory);
        }
        return await repo.save(entity);
    }
    async updateWithManager(manager, entity) {
        return await manager.save(cattle_weight_history_entity_1.CattleWeightHistory, entity);
    }
    async deleteById(idTenant, id) {
        await this.repo.delete({ idTenant, id });
    }
    async deleteByIdWithManager(idTenant, id, manager) {
        await manager.delete(cattle_weight_history_entity_1.CattleWeightHistory, { idTenant, id });
    }
};
exports.CattleWeightHistoryRepository = CattleWeightHistoryRepository;
exports.CattleWeightHistoryRepository = CattleWeightHistoryRepository = CattleWeightHistoryRepository_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(cattle_weight_history_entity_1.CattleWeightHistory)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CattleWeightHistoryRepository);
//# sourceMappingURL=cattle-weight-history.repository.js.map
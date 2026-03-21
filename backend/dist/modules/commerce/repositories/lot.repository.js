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
var LotRepository_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LotRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const lot_entity_1 = require("../entities/lot.entity");
let LotRepository = LotRepository_1 = class LotRepository {
    constructor(dataSource) {
        this.dataSource = dataSource;
        this.logger = new common_1.Logger(LotRepository_1.name);
        this.repository = this.dataSource.getRepository(lot_entity_1.Lot);
    }
    createInstance(data) {
        return this.repository.create(data);
    }
    async save(lot) {
        return this.repository.save(lot);
    }
    async saveWithManager(manager, lot) {
        return manager.save(lot_entity_1.Lot, lot);
    }
    async deleteByPurchaseId(idPurchase, idTenant) {
        await this.repository.delete({ idPurchase, idTenant });
    }
    async deleteByPurchaseIdWithManager(manager, idPurchase, idTenant) {
        await manager.delete(lot_entity_1.Lot, { idPurchase, idTenant });
    }
    async findByPurchaseId(idPurchase, idTenant, manager) {
        const repo = manager?.getRepository(lot_entity_1.Lot) ?? this.repository;
        return repo.find({ where: { idPurchase, idTenant } });
    }
    async findById(idTenant, id, manager) {
        const repo = manager?.getRepository(lot_entity_1.Lot) ?? this.repository;
        const lot = await repo.findOne({ where: { id, idTenant } });
        return lot;
    }
};
exports.LotRepository = LotRepository;
exports.LotRepository = LotRepository = LotRepository_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], LotRepository);
//# sourceMappingURL=lot.repository.js.map
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
exports.LotService = void 0;
const common_1 = require("@nestjs/common");
const lot_repository_1 = require("../repositories/lot.repository");
const lot_entity_1 = require("../entities/lot.entity");
const cattle_repository_1 = require("../../farm/repositories/cattle.repository");
let LotService = class LotService {
    constructor(lotRepository, cattleRepository) {
        this.lotRepository = lotRepository;
        this.cattleRepository = cattleRepository;
    }
    async findByPurchaseId(idPurchase, idTenant) {
        return this.lotRepository.findByPurchaseId(idPurchase, idTenant);
    }
    async findOne(id, idTenant) {
        const lot = await this.lotRepository.findById(id, idTenant);
        if (!lot) {
            throw new common_1.NotFoundException('Lot not found');
        }
        return lot;
    }
    async UpdateLotDataAfterReception(idTenant, idLot, manager) {
        const lot_cattle = await this.cattleRepository.findByIdLot(idTenant, idLot, manager);
        const lot = await this.lotRepository.findById(idTenant, idLot, manager);
        if (!lot) {
            throw new common_1.NotFoundException('Lot not found');
        }
        lot.receivedTotalWeight = 0;
        for (const cattle of lot_cattle) {
            lot.receivedTotalWeight += Number(cattle.receivedWeight || 0);
        }
        lot.receivedCattleCount = lot_cattle.length;
        await manager.getRepository(lot_entity_1.Lot).save(lot);
        return lot;
    }
};
exports.LotService = LotService;
exports.LotService = LotService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [lot_repository_1.LotRepository,
        cattle_repository_1.CattleRepository])
], LotService);
//# sourceMappingURL=lot.service.js.map
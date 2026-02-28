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
var PurchaseService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PurchaseService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const purchase_repository_1 = require("../repositories/purchase.repository");
const lot_repository_1 = require("../repositories/lot.repository");
const purchase_entity_1 = require("../entities/purchase.entity");
const common_2 = require("@nestjs/common");
let PurchaseService = PurchaseService_1 = class PurchaseService {
    dataSource;
    purchaseRepository;
    lotRepository;
    logger = new common_2.Logger(PurchaseService_1.name);
    constructor(dataSource, purchaseRepository, lotRepository) {
        this.dataSource = dataSource;
        this.purchaseRepository = purchaseRepository;
        this.lotRepository = lotRepository;
    }
    async createPurchase(data, idTenant, createdBy) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            var totalCattle = 0;
            var totalWeight = 0;
            if (data.lots) {
                totalCattle = data.lots.reduce((sum, lot) => sum + lot.purchasedCattleCount, 0);
                totalWeight = data.lots.reduce((sum, lot) => sum + lot.totalWeight, 0);
            }
            const purchase = this.purchaseRepository.createInstance({
                idProvider: data.idProvider,
                purchaseDate: new Date(data.purchaseDate),
                totalCattle,
                totalWeight,
                idTenant,
                idCreatedBy: createdBy,
                idUpdatedBy: createdBy
            });
            const savedPurchase = await this.purchaseRepository.saveWithManager(queryRunner.manager, purchase);
            const savedLots = [];
            for (const lotData of data.lots) {
                const lot = this.lotRepository.createInstance({
                    ...lotData,
                    idPurchase: savedPurchase.id,
                    idTenant
                });
                const savedLot = await this.lotRepository.saveWithManager(queryRunner.manager, lot);
                savedLots.push(savedLot);
            }
            savedPurchase.lots = savedLots;
            await queryRunner.commitTransaction();
            return savedPurchase;
        }
        catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        }
        finally {
            await queryRunner.release();
        }
    }
    async updateStatus(id, status, idTenant, updatedBy) {
        const existing = await this.purchaseRepository.findById(id, idTenant);
        if (!existing) {
            throw new common_1.NotFoundException('Purchase not found');
        }
        existing.status = status;
        existing.idUpdatedBy = updatedBy;
        return this.purchaseRepository.save(existing);
    }
    async updatePurchase(id, data, idTenant, updatedBy) {
        const existing = await this.purchaseRepository.findById(id, idTenant);
        if (!existing) {
            throw new common_1.NotFoundException('Purchase not found');
        }
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await this.lotRepository.deleteByPurchaseIdWithManager(queryRunner.manager, id, idTenant);
            var totalCattle = 0;
            var totalWeight = 0;
            if (data.lots) {
                totalCattle = data.lots.reduce((sum, lot) => sum + lot.purchasedCattleCount, 0);
                totalWeight = data.lots.reduce((sum, lot) => sum + lot.totalWeight, 0);
            }
            const savedPurchase = await this.purchaseRepository.saveWithManager(queryRunner.manager, {
                ...existing,
                idProvider: data.idProvider ? data.idProvider : existing.idProvider,
                purchaseDate: data.purchaseDate ? new Date(data.purchaseDate) : existing.purchaseDate,
                totalCattle,
                totalWeight,
                idUpdatedBy: updatedBy
            });
            const savedLots = [];
            for (const lotData of data.lots || []) {
                const lot = this.lotRepository.createInstance({
                    ...lotData,
                    idPurchase: savedPurchase.id,
                    idTenant
                });
                const savedLot = await this.lotRepository.saveWithManager(queryRunner.manager, lot);
                savedLots.push(savedLot);
            }
            savedPurchase.lots = savedLots;
            await queryRunner.commitTransaction();
            return savedPurchase;
        }
        catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        }
        finally {
            await queryRunner.release();
        }
    }
    async findById(id, idTenant) {
        const purchase = await this.purchaseRepository.findById(id, idTenant);
        if (!purchase) {
            throw new common_1.NotFoundException('Purchase not found');
        }
        purchase.lots = await this.lotRepository.findByPurchaseId(id, idTenant);
        return purchase;
    }
    async findAll(idTenant) {
        return this.dataSource.getRepository(purchase_entity_1.Purchase).find({
            where: { idTenant },
            relations: ['lots'],
            order: { purchaseDate: 'DESC' },
        });
    }
    async deleteById(id, idTenant) {
        const existing = await this.purchaseRepository.findById(id, idTenant);
        if (!existing) {
            throw new common_1.NotFoundException('Purchase not found');
        }
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await this.lotRepository.deleteByPurchaseIdWithManager(queryRunner.manager, id, idTenant);
            await this.purchaseRepository.deleteById(id, idTenant);
            await queryRunner.commitTransaction();
        }
        catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        }
        finally {
            await queryRunner.release();
        }
    }
    async listPaged(tenantId, q) {
        const page = Math.max(1, q.page ?? 1);
        const limit = Math.max(1, q.limit ?? 10);
        const { total, rows } = await this.purchaseRepository.listPaged(tenantId, q, page, limit);
        const items = rows.map((r) => ({
            id: r.id,
            purchaseDate: new Date(r.purchaseDate).toISOString(),
            providerName: r.providerName ?? null,
            totalCattle: Number(r.totalCattle ?? 0),
            totalWeight: Number(r.totalWeight ?? 0),
            receivedCattle: Number(r.receivedCattle ?? 0),
            receivedWeight: Number(r.receivedWeight ?? 0),
            status: r.status,
        }));
        return { page, limit, total, items };
    }
};
exports.PurchaseService = PurchaseService;
exports.PurchaseService = PurchaseService = PurchaseService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource,
        purchase_repository_1.PurchaseRepository,
        lot_repository_1.LotRepository])
], PurchaseService);
//# sourceMappingURL=purchase.service.js.map
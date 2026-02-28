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
exports.PurchaseRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const purchase_entity_1 = require("../entities/purchase.entity");
let PurchaseRepository = class PurchaseRepository {
    dataSource;
    repository;
    constructor(dataSource) {
        this.dataSource = dataSource;
        this.repository = this.dataSource.getRepository(purchase_entity_1.Purchase);
    }
    createInstance(data) {
        return this.repository.create(data);
    }
    async save(purchase) {
        return this.repository.save(purchase);
    }
    async saveWithManager(manager, purchase) {
        return manager.save(purchase_entity_1.Purchase, purchase);
    }
    async findById(id, idTenant, manager) {
        const repo = manager?.getRepository(purchase_entity_1.Purchase) ?? this.repository;
        return repo.findOne({
            where: { id, idTenant },
            relations: ['lots'],
        });
    }
    async deleteById(id, idTenant) {
        await this.repository.delete({ id, idTenant });
    }
    async listPaged(tenantId, q, page, limit) {
        const { from, to, provider, status = 'all' } = q;
        const qb = this.repository.createQueryBuilder('p')
            .leftJoin('providers', 'prov', 'prov.id = p.id_provider')
            .leftJoin(qb1 => qb1
            .subQuery()
            .select('lot.id_purchase', 'id_purchase')
            .addSelect('SUM(lot.purchased_cattle_count)', 'total_cattle')
            .addSelect('SUM(lot.total_weight)', 'total_weight')
            .addSelect('SUM(lot.received_cattle_count)', 'received_cattle_lot')
            .from('lots', 'lot')
            .groupBy('lot.id_purchase'), 'lot_agg', 'lot_agg.id_purchase = p.id')
            .leftJoin(qb2 => qb2
            .subQuery()
            .select('c.id_purchase', 'id_purchase')
            .addSelect('COUNT(*)', 'received_cattle_no_lot')
            .from('cattle', 'c')
            .where('c.id_lot IS NULL')
            .groupBy('c.id_purchase'), 'c_agg', 'c_agg.id_purchase = p.id')
            .where('p.id_tenant = :tenantId', { tenantId });
        if (from)
            qb.andWhere('p.purchase_date >= :from', { from });
        if (to)
            qb.andWhere('p.purchase_date <= :to', { to });
        if (provider)
            qb.andWhere('prov.name ILIKE :prov', { prov: `%${provider}%` });
        qb.select([
            'p.id AS id',
            'p.purchase_date AS "purchaseDate"',
            'prov.name AS "providerName"',
            'p.status AS "status"',
            'COALESCE(lot_agg.total_cattle, 0) AS "totalCattle"',
            'COALESCE(lot_agg.total_weight, 0) AS "totalWeight"',
            'COALESCE(lot_agg.received_cattle_lot, 0) AS "receivedCattleLot"',
            'COALESCE(c_agg.received_cattle_no_lot, 0) AS "receivedCattleNoLot"',
            '(COALESCE(lot_agg.received_cattle_lot, 0) + COALESCE(c_agg.received_cattle_no_lot, 0)) AS "receivedCattle"',
        ]);
        if (status && status !== 'all') {
            const dbStatus = status.toUpperCase();
            qb.andWhere('p.status = :dbStatus', { dbStatus });
        }
        const totalRaw = await qb.clone()
            .select('COUNT(DISTINCT p.id)', 'cnt')
            .offset(undefined)
            .limit(undefined)
            .orderBy()
            .getRawOne();
        const total = Number(totalRaw?.cnt ?? 0);
        qb.orderBy('p.purchase_date', 'DESC')
            .offset((page - 1) * limit)
            .limit(limit);
        const rows = await qb.getRawMany();
        return { total, rows };
    }
};
exports.PurchaseRepository = PurchaseRepository;
exports.PurchaseRepository = PurchaseRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], PurchaseRepository);
//# sourceMappingURL=purchase.repository.js.map
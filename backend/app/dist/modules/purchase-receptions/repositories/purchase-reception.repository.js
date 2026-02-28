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
exports.PurchaseReceptionRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const purchase_reception_entity_1 = require("../entities/purchase-reception.entity");
let PurchaseReceptionRepository = class PurchaseReceptionRepository extends typeorm_1.Repository {
    ds;
    repository;
    constructor(ds) {
        super(purchase_reception_entity_1.PurchaseReception, ds.createEntityManager());
        this.ds = ds;
        this.repository = ds.getRepository(purchase_reception_entity_1.PurchaseReception);
    }
    findByPurchase(idTenant, idPurchase, manager) {
        const repo = manager?.getRepository(purchase_reception_entity_1.PurchaseReception) ?? this.repository;
        var reception = repo.findOne({
            where: { idTenant, idPurchase },
        });
        return reception;
    }
    createInstance(data, manager) {
        const repo = manager?.getRepository(purchase_reception_entity_1.PurchaseReception) ?? this.repository;
        return repo.save(repo.create(data));
    }
    async insertUnique(pr, m) {
        return m
            .createQueryBuilder()
            .insert()
            .into(purchase_reception_entity_1.PurchaseReception)
            .values(pr)
            .orIgnore()
            .returning('*')
            .execute();
    }
};
exports.PurchaseReceptionRepository = PurchaseReceptionRepository;
exports.PurchaseReceptionRepository = PurchaseReceptionRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], PurchaseReceptionRepository);
//# sourceMappingURL=purchase-reception.repository.js.map
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
exports.Sale = void 0;
const typeorm_1 = require("typeorm");
const provider_entity_1 = require("./provider.entity");
const sale_detail_entity_1 = require("./sale-detail.entity");
let Sale = class Sale {
};
exports.Sale = Sale;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Sale.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'transaction_date', type: 'timestamp' }),
    __metadata("design:type", Date)
], Sale.prototype, "transactionDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'buyer_id', type: 'uuid' }),
    __metadata("design:type", String)
], Sale.prototype, "buyerId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => provider_entity_1.Provider),
    (0, typeorm_1.JoinColumn)({ name: 'buyer_id' }),
    __metadata("design:type", provider_entity_1.Provider)
], Sale.prototype, "buyer", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'transporter_id', type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Sale.prototype, "transporterId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => provider_entity_1.Provider),
    (0, typeorm_1.JoinColumn)({ name: 'transporter_id' }),
    __metadata("design:type", provider_entity_1.Provider)
], Sale.prototype, "transporter", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'min_weight_config', type: 'numeric', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Sale.prototype, "minWeightConfig", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'value_per_kg_config', type: 'numeric', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Sale.prototype, "valuePerKgConfig", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'total_animal_count', type: 'int' }),
    __metadata("design:type", Number)
], Sale.prototype, "totalAnimalCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'total_weight_kg', type: 'numeric', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Sale.prototype, "totalWeightKg", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'total_amount', type: 'numeric', precision: 12, scale: 2 }),
    __metadata("design:type", Number)
], Sale.prototype, "totalAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'notes', type: 'text', nullable: true }),
    __metadata("design:type", String)
], Sale.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => sale_detail_entity_1.SaleDetail, (detail) => detail.sale),
    __metadata("design:type", Array)
], Sale.prototype, "details", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_tenant', type: 'uuid' }),
    __metadata("design:type", String)
], Sale.prototype, "idTenant", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_by', type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Sale.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Sale.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Sale.prototype, "updatedAt", void 0);
exports.Sale = Sale = __decorate([
    (0, typeorm_1.Entity)('sales')
], Sale);
//# sourceMappingURL=sale.entity.js.map
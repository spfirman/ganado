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
exports.Purchase = void 0;
const typeorm_1 = require("typeorm");
const lot_entity_1 = require("./lot.entity");
const cattle_entity_1 = require("../../farm/entities/cattle.entity");
let Purchase = class Purchase {
    id;
    idTenant;
    purchaseDate;
    totalCattle;
    totalWeight;
    status;
    idProvider;
    lots;
    cattle;
    idCreatedBy;
    idUpdatedBy;
    createdAt;
    updatedAt;
};
exports.Purchase = Purchase;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Purchase.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_tenant', type: 'uuid' }),
    __metadata("design:type", String)
], Purchase.prototype, "idTenant", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'purchase_date', type: 'date' }),
    __metadata("design:type", Date)
], Purchase.prototype, "purchaseDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'total_cattle', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Purchase.prototype, "totalCattle", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'total_weight', type: 'numeric', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Purchase.prototype, "totalWeight", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ['OPEN', 'RECEIVED'],
        default: 'OPEN',
    }),
    __metadata("design:type", String)
], Purchase.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_provider', type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Purchase.prototype, "idProvider", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => lot_entity_1.Lot, (lot) => lot.purchase),
    __metadata("design:type", Array)
], Purchase.prototype, "lots", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => cattle_entity_1.Cattle, (cattle) => cattle.purchase),
    __metadata("design:type", Array)
], Purchase.prototype, "cattle", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_by', type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Purchase.prototype, "idCreatedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'updated_by', type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Purchase.prototype, "idUpdatedBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Purchase.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Purchase.prototype, "updatedAt", void 0);
exports.Purchase = Purchase = __decorate([
    (0, typeorm_1.Entity)('purchases')
], Purchase);
//# sourceMappingURL=purchase.entity.js.map
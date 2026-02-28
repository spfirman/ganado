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
exports.Lot = void 0;
const typeorm_1 = require("typeorm");
const purchase_entity_1 = require("./purchase.entity");
const cattle_gender_enum_1 = require("../../farm/enums/cattle-gender.enum");
let Lot = class Lot {
    id;
    idTenant;
    lotNumber;
    originPlace;
    purchasedCattleCount;
    receivedCattleCount;
    averageWeight;
    totalWeight;
    receivedTotalWeight;
    pricePerKg;
    totalValue;
    gender;
    idPurchase;
    purchase;
    created_at;
    updated_at;
};
exports.Lot = Lot;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Lot.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_tenant', type: 'uuid' }),
    __metadata("design:type", String)
], Lot.prototype, "idTenant", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'lot_number', length: 5 }),
    __metadata("design:type", String)
], Lot.prototype, "lotNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'origin_place', length: 150, nullable: true }),
    __metadata("design:type", String)
], Lot.prototype, "originPlace", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'purchased_cattle_count', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Lot.prototype, "purchasedCattleCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'received_cattle_count', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Lot.prototype, "receivedCattleCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'average_weight', type: 'numeric', precision: 8, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Lot.prototype, "averageWeight", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'total_weight', type: 'numeric', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Lot.prototype, "totalWeight", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'received_total_weight', type: 'numeric', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Lot.prototype, "receivedTotalWeight", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'price_per_kg', type: 'numeric', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Lot.prototype, "pricePerKg", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'total_value', type: 'numeric', precision: 12, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Lot.prototype, "totalValue", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: cattle_gender_enum_1.CattleGender,
        enumName: 'gender_enum',
        default: cattle_gender_enum_1.CattleGender.MALE,
    }),
    __metadata("design:type", String)
], Lot.prototype, "gender", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_purchase', type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Lot.prototype, "idPurchase", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => purchase_entity_1.Purchase, (purchase) => purchase.lots, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'id_purchase' }),
    __metadata("design:type", purchase_entity_1.Purchase)
], Lot.prototype, "purchase", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Lot.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Lot.prototype, "updated_at", void 0);
exports.Lot = Lot = __decorate([
    (0, typeorm_1.Entity)('lots')
], Lot);
//# sourceMappingURL=lot.entity.js.map
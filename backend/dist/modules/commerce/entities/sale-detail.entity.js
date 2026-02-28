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
exports.SaleDetail = void 0;
const typeorm_1 = require("typeorm");
const sale_entity_1 = require("./sale.entity");
const cattle_entity_1 = require("../../farm/entities/cattle.entity");
let SaleDetail = class SaleDetail {
    id;
    saleId;
    sale;
    cattleId;
    cattle;
    measuredWeight;
    isApproved;
    rejectionReason;
    trackerRemoved;
    calculatedPrice;
    idTenant;
    createdAt;
};
exports.SaleDetail = SaleDetail;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], SaleDetail.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sale_id', type: 'uuid' }),
    __metadata("design:type", String)
], SaleDetail.prototype, "saleId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => sale_entity_1.Sale),
    (0, typeorm_1.JoinColumn)({ name: 'sale_id' }),
    __metadata("design:type", sale_entity_1.Sale)
], SaleDetail.prototype, "sale", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cattle_id', type: 'uuid' }),
    __metadata("design:type", String)
], SaleDetail.prototype, "cattleId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => cattle_entity_1.Cattle),
    (0, typeorm_1.JoinColumn)({ name: 'cattle_id' }),
    __metadata("design:type", cattle_entity_1.Cattle)
], SaleDetail.prototype, "cattle", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'measured_weight', type: 'numeric', precision: 6, scale: 2 }),
    __metadata("design:type", Number)
], SaleDetail.prototype, "measuredWeight", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_approved', type: 'boolean' }),
    __metadata("design:type", Boolean)
], SaleDetail.prototype, "isApproved", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'rejection_reason', type: 'text', nullable: true }),
    __metadata("design:type", String)
], SaleDetail.prototype, "rejectionReason", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tracker_removed', type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], SaleDetail.prototype, "trackerRemoved", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'calculated_price', type: 'numeric', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], SaleDetail.prototype, "calculatedPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_tenant', type: 'uuid' }),
    __metadata("design:type", String)
], SaleDetail.prototype, "idTenant", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], SaleDetail.prototype, "createdAt", void 0);
exports.SaleDetail = SaleDetail = __decorate([
    (0, typeorm_1.Entity)('sale_details')
], SaleDetail);
//# sourceMappingURL=sale-detail.entity.js.map
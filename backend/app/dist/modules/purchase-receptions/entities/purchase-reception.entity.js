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
exports.PurchaseReception = void 0;
const typeorm_1 = require("typeorm");
let PurchaseReception = class PurchaseReception {
    id;
    idTenant;
    idPurchase;
    idMassiveEvent;
    receivedAt;
    nextCattleNumber;
    createdAt;
    updatedAt;
};
exports.PurchaseReception = PurchaseReception;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], PurchaseReception.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid', { name: 'id_tenant' }),
    __metadata("design:type", String)
], PurchaseReception.prototype, "idTenant", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid', { name: 'id_purchase' }),
    __metadata("design:type", String)
], PurchaseReception.prototype, "idPurchase", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid', { name: 'id_massive_event' }),
    __metadata("design:type", String)
], PurchaseReception.prototype, "idMassiveEvent", void 0);
__decorate([
    (0, typeorm_1.Column)('timestamp', { name: 'received_at', default: () => 'now()' }),
    __metadata("design:type", Date)
], PurchaseReception.prototype, "receivedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'next_cattle_number', length: 50 }),
    __metadata("design:type", String)
], PurchaseReception.prototype, "nextCattleNumber", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], PurchaseReception.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], PurchaseReception.prototype, "updatedAt", void 0);
exports.PurchaseReception = PurchaseReception = __decorate([
    (0, typeorm_1.Entity)({ name: 'purchase_receptions' }),
    (0, typeorm_1.Index)('ix_purchase_receptions_tenant_purchase', ['idTenant', 'idPurchase'])
], PurchaseReception);
//# sourceMappingURL=purchase-reception.entity.js.map
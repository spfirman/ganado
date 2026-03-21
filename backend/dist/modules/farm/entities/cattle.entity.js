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
exports.Cattle = exports.CattleStatus = void 0;
const typeorm_1 = require("typeorm");
const device_entity_1 = require("../../production-center/entities/device.entity");
const purchase_entity_1 = require("../../commerce/entities/purchase.entity");
const cattle_color_enum_1 = require("../enums/cattle-color.enum");
const cattle_characteristic_entity_1 = require("./cattle-characteristic.entity");
const cattle_gender_enum_1 = require("../enums/cattle-gender.enum");
var CattleStatus;
(function (CattleStatus) {
    CattleStatus["ACTIVE"] = "ACTIVE";
    CattleStatus["SOLD"] = "SOLD";
    CattleStatus["DEAD"] = "DEAD";
    CattleStatus["LOST"] = "LOST";
})(CattleStatus || (exports.CattleStatus = CattleStatus = {}));
let Cattle = class Cattle {
};
exports.Cattle = Cattle;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Cattle.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_tenant', type: 'uuid' }),
    __metadata("design:type", String)
], Cattle.prototype, "idTenant", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sys_number', length: 50 }),
    __metadata("design:type", String)
], Cattle.prototype, "sysNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50 }),
    __metadata("design:type", String)
], Cattle.prototype, "number", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'received_at', type: 'date' }),
    __metadata("design:type", Date)
], Cattle.prototype, "receivedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'received_weight', type: 'numeric', precision: 6, scale: 2 }),
    __metadata("design:type", Number)
], Cattle.prototype, "receivedWeight", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_purchase', type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Cattle.prototype, "idPurchase", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => purchase_entity_1.Purchase, (purchase) => purchase.cattle, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'id_purchase' }),
    __metadata("design:type", purchase_entity_1.Purchase)
], Cattle.prototype, "purchase", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'purchase_weight', type: 'numeric', precision: 6, scale: 2 }),
    __metadata("design:type", Number)
], Cattle.prototype, "purchaseWeight", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'purchase_price', type: 'numeric', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Cattle.prototype, "purchasePrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_lot', type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Cattle.prototype, "idLot", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_brand', type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Cattle.prototype, "idBrand", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: cattle_color_enum_1.CattleColor,
        enumName: 'colors_enum',
        default: cattle_color_enum_1.CattleColor.WHITE,
    }),
    __metadata("design:type", String)
], Cattle.prototype, "color", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => cattle_characteristic_entity_1.CattleCharacteristic, (cattleCharacteristic) => cattleCharacteristic.cattle),
    __metadata("design:type", Array)
], Cattle.prototype, "cattleCharacteristics", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'eid_tag', type: 'varchar', length: 30, nullable: true }),
    __metadata("design:type", String)
], Cattle.prototype, "eidTag", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'eartag_left', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], Cattle.prototype, "eartagLeft", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'eartag_right', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], Cattle.prototype, "eartagRight", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_device', type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Cattle.prototype, "idDevice", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => device_entity_1.Device, { nullable: true, onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'id_device' }),
    __metadata("design:type", device_entity_1.Device)
], Cattle.prototype, "device", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'castrated', type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Cattle.prototype, "castrated", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'castration_date', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Cattle.prototype, "castrationDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Cattle.prototype, "comments", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'purchase_commission', type: 'numeric', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Cattle.prototype, "purchaseCommission", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'negotiated_price_per_kg', type: 'numeric', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Cattle.prototype, "negotiatedPricePerKg", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'lot_price_per_weight', type: 'numeric', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Cattle.prototype, "lotPricePerWeight", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sale_price', type: 'numeric', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Cattle.prototype, "salePrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sale_price_per_kg', type: 'numeric', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Cattle.prototype, "salePricePerKg", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sale_weight', type: 'numeric', precision: 6, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Cattle.prototype, "saleWeight", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'average_gr', type: 'numeric', precision: 6, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Cattle.prototype, "averageGr", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'purchased_from', length: 100 }),
    __metadata("design:type", String)
], Cattle.prototype, "purchasedFrom", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_provider', type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Cattle.prototype, "idProvider", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'last_weight', type: 'numeric', precision: 6, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Cattle.prototype, "lastWeight", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'has_horns', type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Cattle.prototype, "hasHorn", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: CattleStatus,
        enumName: 'cattle_status_enum',
        default: CattleStatus.ACTIVE,
    }),
    __metadata("design:type", String)
], Cattle.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: cattle_gender_enum_1.CattleGender,
        enumName: 'gender_enum',
    }),
    __metadata("design:type", String)
], Cattle.prototype, "gender", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'birth_date_aprx', type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Cattle.prototype, "birthDateAprx", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'new_feed_start_date', type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Cattle.prototype, "newFeedStartDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'average_daily_gain', type: 'numeric', precision: 6, scale: 3, nullable: true }),
    __metadata("design:type", Number)
], Cattle.prototype, "averageDailyGain", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Cattle.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Cattle.prototype, "updatedAt", void 0);
exports.Cattle = Cattle = __decorate([
    (0, typeorm_1.Entity)('cattle'),
    (0, typeorm_1.Index)(['idTenant', 'number']),
    (0, typeorm_1.Index)(['idTenant', 'status'])
], Cattle);
//# sourceMappingURL=cattle.entity.js.map
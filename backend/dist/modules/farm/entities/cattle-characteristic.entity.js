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
exports.CattleCharacteristic = void 0;
const typeorm_1 = require("typeorm");
const tenant_entity_1 = require("../../employee-management/entities/tenant.entity");
const cattle_entity_1 = require("./cattle.entity");
const cattle_characteristic_enum_1 = require("../enums/cattle-characteristic.enum");
let CattleCharacteristic = class CattleCharacteristic {
};
exports.CattleCharacteristic = CattleCharacteristic;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], CattleCharacteristic.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => tenant_entity_1.Tenant, { nullable: false, onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'id_tenant' }),
    __metadata("design:type", tenant_entity_1.Tenant)
], CattleCharacteristic.prototype, "idTenant", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_cattle', type: 'uuid', nullable: false }),
    __metadata("design:type", String)
], CattleCharacteristic.prototype, "idCattle", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => cattle_entity_1.Cattle, { nullable: false, onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'id_cattle' }),
    __metadata("design:type", cattle_entity_1.Cattle)
], CattleCharacteristic.prototype, "cattle", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: cattle_characteristic_enum_1.CattleCharacteristicEnum,
        enumName: 'characteristics_enum',
    }),
    __metadata("design:type", String)
], CattleCharacteristic.prototype, "characteristic", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], CattleCharacteristic.prototype, "createdAt", void 0);
exports.CattleCharacteristic = CattleCharacteristic = __decorate([
    (0, typeorm_1.Entity)({ name: 'cattle_characteristics' }),
    (0, typeorm_1.Unique)('ux_cattle_characteristics_unique', ['cattle', 'characteristic'])
], CattleCharacteristic);
//# sourceMappingURL=cattle-characteristic.entity.js.map
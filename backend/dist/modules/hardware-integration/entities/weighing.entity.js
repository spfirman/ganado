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
exports.Weighing = void 0;
const typeorm_1 = require("typeorm");
const cattle_entity_1 = require("../../farm/entities/cattle.entity");
const weighing_source_enum_1 = require("../enums/weighing-source.enum");
const weighing_media_entity_1 = require("./weighing-media.entity");
let Weighing = class Weighing {
};
exports.Weighing = Weighing;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Weighing.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_tenant', type: 'uuid' }),
    __metadata("design:type", String)
], Weighing.prototype, "idTenant", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_cattle', type: 'uuid' }),
    __metadata("design:type", String)
], Weighing.prototype, "idCattle", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => cattle_entity_1.Cattle, { nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: 'id_cattle' }),
    __metadata("design:type", cattle_entity_1.Cattle)
], Weighing.prototype, "cattle", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'eid_tag', type: 'varchar', length: 30, nullable: true }),
    __metadata("design:type", String)
], Weighing.prototype, "eidTag", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'gross_weight_kg', type: 'numeric', precision: 8, scale: 2 }),
    __metadata("design:type", Number)
], Weighing.prototype, "grossWeightKg", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'net_weight_kg', type: 'numeric', precision: 8, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Weighing.prototype, "netWeightKg", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tare_kg', type: 'numeric', precision: 8, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Weighing.prototype, "tareKg", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'stable_at', type: 'timestamp with time zone', nullable: true }),
    __metadata("design:type", Date)
], Weighing.prototype, "stableAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'operator_id', type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Weighing.prototype, "operatorId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: weighing_source_enum_1.WeighingSource,
        enumName: 'weighing_source_enum',
        default: weighing_source_enum_1.WeighingSource.MANUAL,
    }),
    __metadata("design:type", String)
], Weighing.prototype, "source", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'bridge_device_id', type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Weighing.prototype, "bridgeDeviceId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Weighing.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => weighing_media_entity_1.WeighingMedia, (media) => media.weighing),
    __metadata("design:type", Array)
], Weighing.prototype, "media", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Weighing.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Weighing.prototype, "updatedAt", void 0);
exports.Weighing = Weighing = __decorate([
    (0, typeorm_1.Entity)('weighings'),
    (0, typeorm_1.Index)(['idTenant', 'createdAt']),
    (0, typeorm_1.Index)(['idTenant', 'idCattle'])
], Weighing);
//# sourceMappingURL=weighing.entity.js.map
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
exports.Device = void 0;
const typeorm_1 = require("typeorm");
const device_profile_entity_1 = require("./device-profile.entity");
let Device = class Device {
};
exports.Device = Device;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Device.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 32, nullable: false, unique: true }),
    __metadata("design:type", String)
], Device.prototype, "deveui", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_tenant', type: 'uuid', nullable: false }),
    __metadata("design:type", String)
], Device.prototype, "idTenant", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_device_profile', type: 'uuid', nullable: false }),
    __metadata("design:type", String)
], Device.prototype, "idDeviceProfile", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: false }),
    __metadata("design:type", String)
], Device.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Device.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', default: {} }),
    __metadata("design:type", Object)
], Device.prototype, "tags", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', default: {} }),
    __metadata("design:type", Object)
], Device.prototype, "variables", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_chirpstack_profile', type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Device.prototype, "idChirpstackProfile", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cs_application_id', type: 'uuid', nullable: false }),
    __metadata("design:type", String)
], Device.prototype, "csApplicationId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cs_joineui', type: 'varchar', length: 16, nullable: true }),
    __metadata("design:type", String)
], Device.prototype, "csJoineui", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cs_app_key', type: 'varchar', length: 32, nullable: true }),
    __metadata("design:type", String)
], Device.prototype, "csAppKey", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cs_nwk_key', type: 'varchar', length: 32, nullable: true }),
    __metadata("design:type", String)
], Device.prototype, "csNwkKey", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'battery_status', length: 100, nullable: true }),
    __metadata("design:type", String)
], Device.prototype, "batteryStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'battery_update', nullable: true }),
    __metadata("design:type", Date)
], Device.prototype, "batteryUpdate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', type: 'boolean', default: true, nullable: false }),
    __metadata("design:type", Boolean)
], Device.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', nullable: false }),
    __metadata("design:type", Date)
], Device.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', nullable: false }),
    __metadata("design:type", Date)
], Device.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => device_profile_entity_1.DeviceProfile),
    (0, typeorm_1.JoinColumn)({ name: 'id_device_profile' }),
    __metadata("design:type", device_profile_entity_1.DeviceProfile)
], Device.prototype, "deviceProfile", void 0);
exports.Device = Device = __decorate([
    (0, typeorm_1.Entity)('devices')
], Device);
//# sourceMappingURL=device.entity.js.map
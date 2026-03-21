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
exports.DeviceProfile = void 0;
const typeorm_1 = require("typeorm");
let DeviceProfile = class DeviceProfile {
};
exports.DeviceProfile = DeviceProfile;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], DeviceProfile.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_tenant', type: 'uuid', nullable: false }),
    __metadata("design:type", String)
], DeviceProfile.prototype, "idTenant", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: false }),
    __metadata("design:type", String)
], DeviceProfile.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], DeviceProfile.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_chipstack', type: 'uuid', nullable: false }),
    __metadata("design:type", String)
], DeviceProfile.prototype, "idChipstack", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cs_application_id', type: 'uuid', nullable: false }),
    __metadata("design:type", String)
], DeviceProfile.prototype, "csApplicationId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cs_joineui', type: 'varchar', length: 16, nullable: false }),
    __metadata("design:type", String)
], DeviceProfile.prototype, "csJoineui", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cs_app_key', type: 'varchar', length: 32, nullable: true }),
    __metadata("design:type", String)
], DeviceProfile.prototype, "csAppKey", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cs_nwk_key', type: 'varchar', length: 32, nullable: false }),
    __metadata("design:type", String)
], DeviceProfile.prototype, "csNwkKey", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'fcc_id', type: 'varchar', length: 40, nullable: false }),
    __metadata("design:type", String)
], DeviceProfile.prototype, "fccId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: false }),
    __metadata("design:type", String)
], DeviceProfile.prototype, "regions", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: false }),
    __metadata("design:type", String)
], DeviceProfile.prototype, "model", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    __metadata("design:type", String)
], DeviceProfile.prototype, "input", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'date', nullable: false }),
    __metadata("design:type", Date)
], DeviceProfile.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'date', nullable: false }),
    __metadata("design:type", Date)
], DeviceProfile.prototype, "updatedAt", void 0);
exports.DeviceProfile = DeviceProfile = __decorate([
    (0, typeorm_1.Entity)('device_profiles')
], DeviceProfile);
//# sourceMappingURL=device-profile.entity.js.map
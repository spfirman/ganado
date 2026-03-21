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
exports.BridgeDevice = void 0;
const typeorm_1 = require("typeorm");
const weighing_source_enum_1 = require("../enums/weighing-source.enum");
let BridgeDevice = class BridgeDevice {
};
exports.BridgeDevice = BridgeDevice;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], BridgeDevice.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_tenant', type: 'uuid' }),
    __metadata("design:type", String)
], BridgeDevice.prototype, "idTenant", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], BridgeDevice.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: weighing_source_enum_1.BridgeDeviceType,
        enumName: 'bridge_device_type_enum',
    }),
    __metadata("design:type", String)
], BridgeDevice.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ip_address', type: 'varchar', length: 45, nullable: true }),
    __metadata("design:type", String)
], BridgeDevice.prototype, "ipAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: weighing_source_enum_1.BridgeDeviceStatus,
        enumName: 'bridge_device_status_enum',
        default: weighing_source_enum_1.BridgeDeviceStatus.OFFLINE,
    }),
    __metadata("design:type", String)
], BridgeDevice.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'last_seen_at', type: 'timestamp with time zone', nullable: true }),
    __metadata("design:type", Date)
], BridgeDevice.prototype, "lastSeenAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'config_json', type: 'jsonb', default: '{}' }),
    __metadata("design:type", Object)
], BridgeDevice.prototype, "configJson", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'api_key', type: 'varchar', length: 128, nullable: true }),
    __metadata("design:type", String)
], BridgeDevice.prototype, "apiKey", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], BridgeDevice.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], BridgeDevice.prototype, "updatedAt", void 0);
exports.BridgeDevice = BridgeDevice = __decorate([
    (0, typeorm_1.Entity)('bridge_devices'),
    (0, typeorm_1.Index)(['idTenant'])
], BridgeDevice);
//# sourceMappingURL=bridge-device.entity.js.map
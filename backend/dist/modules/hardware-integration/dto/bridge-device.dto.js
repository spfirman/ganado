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
exports.BridgeStatusResponseDto = exports.DeviceHeartbeatDto = exports.RegisterDeviceDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const weighing_source_enum_1 = require("../enums/weighing-source.enum");
class RegisterDeviceDto {
}
exports.RegisterDeviceDto = RegisterDeviceDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Device display name' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterDeviceDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Device type', enum: weighing_source_enum_1.BridgeDeviceType }),
    (0, class_validator_1.IsEnum)(weighing_source_enum_1.BridgeDeviceType),
    __metadata("design:type", String)
], RegisterDeviceDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Device IP address on farm LAN' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterDeviceDto.prototype, "ipAddress", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Device configuration JSON' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], RegisterDeviceDto.prototype, "configJson", void 0);
class DeviceHeartbeatDto {
}
exports.DeviceHeartbeatDto = DeviceHeartbeatDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Current device status details' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], DeviceHeartbeatDto.prototype, "statusDetails", void 0);
class BridgeStatusResponseDto {
}
exports.BridgeStatusResponseDto = BridgeStatusResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], BridgeStatusResponseDto.prototype, "deviceId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], BridgeStatusResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], BridgeStatusResponseDto.prototype, "lastSeenAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Number)
], BridgeStatusResponseDto.prototype, "pollIntervalMs", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], BridgeStatusResponseDto.prototype, "cameraSettings", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], BridgeStatusResponseDto.prototype, "scaleSettings", void 0);
//# sourceMappingURL=bridge-device.dto.js.map
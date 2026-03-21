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
exports.UpdateDeviceProfileDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class UpdateDeviceProfileDto {
}
exports.UpdateDeviceProfileDto = UpdateDeviceProfileDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateDeviceProfileDto.prototype, "idTenant", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Nombre del perfil de dispositivo', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateDeviceProfileDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Descripcion del perfil de dispositivo', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateDeviceProfileDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID del perfil en Chirpstack', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], UpdateDeviceProfileDto.prototype, "idChipstack", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID de la aplicacion en Chirpstack', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], UpdateDeviceProfileDto.prototype, "csApplicationId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Join EUI en Chirpstack', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(16, 16),
    __metadata("design:type", String)
], UpdateDeviceProfileDto.prototype, "csJoineui", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'App Key en Chirpstack', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(32, 32),
    __metadata("design:type", String)
], UpdateDeviceProfileDto.prototype, "csAppKey", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'NWK Key en Chirpstack', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(32, 32),
    __metadata("design:type", String)
], UpdateDeviceProfileDto.prototype, "csNwkKey", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'FCC ID', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateDeviceProfileDto.prototype, "fccId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Regiones', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateDeviceProfileDto.prototype, "regions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Modelo', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateDeviceProfileDto.prototype, "model", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Input', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateDeviceProfileDto.prototype, "input", void 0);
__decorate([
    (0, class_validator_1.IsDate)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], UpdateDeviceProfileDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=update-device-profile.dto.js.map
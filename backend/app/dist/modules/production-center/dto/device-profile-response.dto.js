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
exports.DeviceProfileResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
let DeviceProfileResponseDto = class DeviceProfileResponseDto {
    id;
    name;
    idChipstack;
    csApplicationId;
    csJoineui;
    csAppKey;
    csNwkKey;
    fccId;
    regions;
    model;
    input;
    createdAt;
    updatedAt;
};
exports.DeviceProfileResponseDto = DeviceProfileResponseDto;
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ description: 'ID del perfil de dispositivo' }),
    __metadata("design:type", String)
], DeviceProfileResponseDto.prototype, "id", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ description: 'Nombre del perfil de dispositivo' }),
    __metadata("design:type", String)
], DeviceProfileResponseDto.prototype, "name", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ description: 'ID del perfil en Chirpstack' }),
    __metadata("design:type", String)
], DeviceProfileResponseDto.prototype, "idChipstack", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ description: 'ID de la aplicación en Chirpstack' }),
    __metadata("design:type", String)
], DeviceProfileResponseDto.prototype, "csApplicationId", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ description: 'Join EUI en Chirpstack' }),
    __metadata("design:type", String)
], DeviceProfileResponseDto.prototype, "csJoineui", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ description: 'App Key en Chirpstack' }),
    __metadata("design:type", String)
], DeviceProfileResponseDto.prototype, "csAppKey", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ description: 'NWK Key en Chirpstack' }),
    __metadata("design:type", String)
], DeviceProfileResponseDto.prototype, "csNwkKey", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ description: 'FCC ID' }),
    __metadata("design:type", String)
], DeviceProfileResponseDto.prototype, "fccId", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ description: 'Regiones' }),
    __metadata("design:type", String)
], DeviceProfileResponseDto.prototype, "regions", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ description: 'Modelo' }),
    __metadata("design:type", String)
], DeviceProfileResponseDto.prototype, "model", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ description: 'Input' }),
    __metadata("design:type", String)
], DeviceProfileResponseDto.prototype, "input", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ description: 'Fecha de creación' }),
    __metadata("design:type", Date)
], DeviceProfileResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ description: 'Fecha de actualización' }),
    __metadata("design:type", Date)
], DeviceProfileResponseDto.prototype, "updatedAt", void 0);
exports.DeviceProfileResponseDto = DeviceProfileResponseDto = __decorate([
    (0, class_transformer_1.Exclude)()
], DeviceProfileResponseDto);
//# sourceMappingURL=device-profile-response.dto.js.map
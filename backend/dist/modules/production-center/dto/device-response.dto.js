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
exports.DeviceResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class DeviceResponseDto {
}
exports.DeviceResponseDto = DeviceResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID del dispositivo' }),
    __metadata("design:type", String)
], DeviceResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID del perfil de dispositivo' }),
    __metadata("design:type", String)
], DeviceResponseDto.prototype, "idDeviceProfile", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'DevEUI del dispositivo' }),
    __metadata("design:type", String)
], DeviceResponseDto.prototype, "deveui", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Nombre del dispositivo' }),
    __metadata("design:type", String)
], DeviceResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Descripcion del dispositivo' }),
    __metadata("design:type", String)
], DeviceResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID de la aplicacion de ChipStack' }),
    __metadata("design:type", String)
], DeviceResponseDto.prototype, "csApplicationId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'JoinEUI del dispositivo' }),
    __metadata("design:type", String)
], DeviceResponseDto.prototype, "csJoineui", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'AppKey del dispositivo' }),
    __metadata("design:type", String)
], DeviceResponseDto.prototype, "csAppKey", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'NwkKey del dispositivo' }),
    __metadata("design:type", String)
], DeviceResponseDto.prototype, "csNwkKey", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Tags del dispositivo' }),
    __metadata("design:type", Object)
], DeviceResponseDto.prototype, "tags", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Variables del dispositivo' }),
    __metadata("design:type", Object)
], DeviceResponseDto.prototype, "variables", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Estado del dispositivo' }),
    __metadata("design:type", Boolean)
], DeviceResponseDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Fecha de creacion del dispositivo' }),
    __metadata("design:type", Date)
], DeviceResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Fecha de actualizacion del dispositivo' }),
    __metadata("design:type", Date)
], DeviceResponseDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=device-response.dto.js.map
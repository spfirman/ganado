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
exports.CreateDeviceDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateDeviceDto {
}
exports.CreateDeviceDto = CreateDeviceDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateDeviceDto.prototype, "idTenant", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID del perfil de dispositivo' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateDeviceDto.prototype, "idDeviceProfile", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'DevEUI del dispositivo' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateDeviceDto.prototype, "deveui", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Nombre del dispositivo' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateDeviceDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Descripcion del dispositivo' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateDeviceDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID de la aplicacion de ChipStack' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateDeviceDto.prototype, "csApplicationId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'JoinEUI del dispositivo' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Length)(16, 16),
    __metadata("design:type", String)
], CreateDeviceDto.prototype, "csJoineui", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'AppKey del dispositivo' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Length)(32, 32),
    __metadata("design:type", String)
], CreateDeviceDto.prototype, "csAppKey", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'NwkKey del dispositivo' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Length)(32, 32),
    __metadata("design:type", String)
], CreateDeviceDto.prototype, "csNwkKey", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Tags del dispositivo' }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateDeviceDto.prototype, "tags", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Variables del dispositivo' }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateDeviceDto.prototype, "variables", void 0);
__decorate([
    (0, class_validator_1.IsDate)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], CreateDeviceDto.prototype, "createdAt", void 0);
__decorate([
    (0, class_validator_1.IsDate)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], CreateDeviceDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=create-device.dto.js.map
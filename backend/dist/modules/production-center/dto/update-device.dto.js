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
exports.UpdateDeviceDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class UpdateDeviceDto {
    deveui;
    idDeviceProfile;
    name;
    description;
    csApplicationId;
    csJoineui;
    csAppKey;
    csNwkKey;
    tags;
    variables;
    isActive;
    updatedAt;
}
exports.UpdateDeviceDto = UpdateDeviceDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'DevEUI del dispositivo LoRaWAN',
        example: '0000000000000001',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateDeviceDto.prototype, "deveui", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID del perfil de dispositivo en Chirpstack',
        example: 'e7c68b4f-0c09-472a-8b9b-44ca8f074c73',
        required: false,
    }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateDeviceDto.prototype, "idDeviceProfile", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nombre del dispositivo',
        example: 'Sensor de temperatura #1',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateDeviceDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Descripción del dispositivo',
        example: 'Sensor de temperatura ubicado en el invernadero principal',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateDeviceDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID de la aplicación de ChipStack',
        example: 'e7c68b4f-0c09-472a-8b9b-44ca8f074c73',
        required: false,
    }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateDeviceDto.prototype, "csApplicationId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'JoinEUI del dispositivo',
        example: '0000000000000001',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Length)(16, 16),
    __metadata("design:type", String)
], UpdateDeviceDto.prototype, "csJoineui", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'AppKey del dispositivo',
        example: '00000000000000000000000000000001',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Length)(32, 32),
    __metadata("design:type", String)
], UpdateDeviceDto.prototype, "csAppKey", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'NwkKey del dispositivo',
        example: '00000000000000000000000000000001',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Length)(32, 32),
    __metadata("design:type", String)
], UpdateDeviceDto.prototype, "csNwkKey", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tags del dispositivo',
        example: { cattle: 'cattleI' },
        required: false,
    }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdateDeviceDto.prototype, "tags", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Variables del dispositivo',
        example: {},
        required: false,
    }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdateDeviceDto.prototype, "variables", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Estado del dispositivo',
        example: true,
        required: false,
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateDeviceDto.prototype, "isActive", void 0);
__decorate([
    (0, class_validator_1.IsDate)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], UpdateDeviceDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=update-device.dto.js.map
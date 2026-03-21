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
exports.CreateProviderDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const provider_entity_1 = require("../entities/provider.entity");
class CreateProviderDto {
}
exports.CreateProviderDto = CreateProviderDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Ganaderia La Ponderosa', description: 'Provider name' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Length)(3, 150),
    __metadata("design:type", String)
], CreateProviderDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '900123456-7', description: 'NIT (unique)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Length)(5, 20),
    __metadata("design:type", String)
], CreateProviderDto.prototype, "nit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'BUYER', enum: provider_entity_1.ProviderType, description: 'Provider type' }),
    (0, class_validator_1.IsEnum)(provider_entity_1.ProviderType),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateProviderDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Calle 123 #45-67', description: 'Address' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateProviderDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Juan Perez', description: 'Contact person name' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateProviderDto.prototype, "contactPersonName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '+57 300 1234567', description: 'Primary phone number' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateProviderDto.prototype, "phone1", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '+57 311 7654321', description: 'Secondary phone number' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateProviderDto.prototype, "phone2", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'contact@ganaderia.com', description: 'Email address' }),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateProviderDto.prototype, "email", void 0);
//# sourceMappingURL=create-provider.dto.js.map
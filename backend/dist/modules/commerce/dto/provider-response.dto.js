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
exports.ProviderResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const provider_entity_1 = require("../entities/provider.entity");
class ProviderResponseDto {
    id;
    name;
    nit;
    type;
    created_at;
    updated_at;
    static toProviderResponse(provider) {
        return {
            id: provider.id,
            name: provider.name,
            nit: provider.nit,
            type: provider.type,
            created_at: provider.created_at,
            updated_at: provider.updated_at,
        };
    }
}
exports.ProviderResponseDto = ProviderResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'c3d1e10b-feb3-48f9-a19c-6f95e7f416bc' }),
    __metadata("design:type", String)
], ProviderResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Ganadería El Porvenir' }),
    __metadata("design:type", String)
], ProviderResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '900123456-7' }),
    __metadata("design:type", String)
], ProviderResponseDto.prototype, "nit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'BUYER', enum: provider_entity_1.ProviderType }),
    __metadata("design:type", String)
], ProviderResponseDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-07-03T18:00:00.000Z' }),
    __metadata("design:type", Date)
], ProviderResponseDto.prototype, "created_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-07-04T10:32:00.000Z' }),
    __metadata("design:type", Date)
], ProviderResponseDto.prototype, "updated_at", void 0);
//# sourceMappingURL=provider-response.dto.js.map
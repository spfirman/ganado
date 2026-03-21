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
exports.BrandResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class BrandResponseDto {
    static toResponseDto(brand) {
        const mime = brand.imageMimeType;
        const base64 = `data:${mime};base64,${brand.image.toString('base64')}`;
        return {
            imageMimeType: brand.imageMimeType,
            imageBase64: base64,
            id: brand.id,
            idTenant: brand.idTenant,
            name: brand.name,
            createdAt: brand.createdAt,
            updatedAt: brand.updatedAt,
        };
    }
}
exports.BrandResponseDto = BrandResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-de-la-marca', description: 'Unique ID of the brand' }),
    __metadata("design:type", String)
], BrandResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Marca A', description: 'Name of the brand' }),
    __metadata("design:type", String)
], BrandResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'tenant-uuid', description: 'Tenant identifier' }),
    __metadata("design:type", String)
], BrandResponseDto.prototype, "idTenant", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-07-24T12:00:00Z', description: 'Creation date' }),
    __metadata("design:type", Date)
], BrandResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-07-24T12:00:00Z', description: 'Last update date' }),
    __metadata("design:type", Date)
], BrandResponseDto.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'image/png', description: 'Type of image, e.g. image/jpg' }),
    __metadata("design:type", String)
], BrandResponseDto.prototype, "imageMimeType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...',
        description: 'Brand image encoded in base64 (data URL)',
        required: false,
    }),
    __metadata("design:type", String)
], BrandResponseDto.prototype, "imageBase64", void 0);
//# sourceMappingURL=brand-response.dto.js.map
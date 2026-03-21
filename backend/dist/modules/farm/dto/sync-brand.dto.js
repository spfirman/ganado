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
exports.SyncBrandResponseDto = exports.SyncBrandResultDto = exports.SyncBrandRequestDto = exports.SyncBrandDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class SyncBrandDto {
    static async parseAndValidateBrands(brandsJson) {
        let parsed;
        try {
            parsed = JSON.parse(brandsJson);
        }
        catch (err) {
            throw new common_1.BadRequestException('Invalid formt for brands.');
        }
        if (!Array.isArray(parsed)) {
            throw new common_1.BadRequestException('Field must be fixed.');
        }
        const brandDtos = (0, class_transformer_1.plainToInstance)(SyncBrandDto, parsed);
        for (const [index, dto] of brandDtos.entries()) {
            const errors = await (0, class_validator_1.validate)(dto);
            if (errors.length > 0) {
                throw new common_1.BadRequestException({
                    message: `Error de validación en brands[${index}]`,
                    errors: errors.map((e) => ({
                        property: e.property,
                        constraints: e.constraints,
                    })),
                });
            }
        }
        return brandDtos;
    }
}
exports.SyncBrandDto = SyncBrandDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-local-brand' }),
    __metadata("design:type", String)
], SyncBrandDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'tenant-uuid' }),
    __metadata("design:type", String)
], SyncBrandDto.prototype, "idTenant", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Marca X' }),
    __metadata("design:type", String)
], SyncBrandDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: 'string', format: 'binary', required: true }),
    __metadata("design:type", Object)
], SyncBrandDto.prototype, "image", void 0);
class SyncBrandRequestDto {
}
exports.SyncBrandRequestDto = SyncBrandRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [SyncBrandDto] }),
    __metadata("design:type", Array)
], SyncBrandRequestDto.prototype, "brands", void 0);
class SyncBrandResultDto {
}
exports.SyncBrandResultDto = SyncBrandResultDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-local-brand' }),
    __metadata("design:type", String)
], SyncBrandResultDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'synced' }),
    __metadata("design:type", String)
], SyncBrandResultDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-server-brand' }),
    __metadata("design:type", String)
], SyncBrandResultDto.prototype, "serverId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Optional error message', required: false }),
    __metadata("design:type", String)
], SyncBrandResultDto.prototype, "message", void 0);
class SyncBrandResponseDto {
}
exports.SyncBrandResponseDto = SyncBrandResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [SyncBrandResultDto] }),
    __metadata("design:type", Array)
], SyncBrandResponseDto.prototype, "results", void 0);
//# sourceMappingURL=sync-brand.dto.js.map
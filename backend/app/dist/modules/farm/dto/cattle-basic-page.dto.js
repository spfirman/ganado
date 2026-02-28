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
exports.CattleBasicPageDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const cattle_basic_response_dto_1 = require("./cattle-basic-response.dto");
class CattleBasicPageDto {
    items;
    nextCursor;
    hasMore;
    total;
}
exports.CattleBasicPageDto = CattleBasicPageDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [cattle_basic_response_dto_1.CattleBasicResponseDto] }),
    __metadata("design:type", Array)
], CattleBasicPageDto.prototype, "items", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Cursor para la siguiente página (null si no hay más)' }),
    __metadata("design:type", Object)
], CattleBasicPageDto.prototype, "nextCursor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Indica si hay más páginas' }),
    __metadata("design:type", Boolean)
], CattleBasicPageDto.prototype, "hasMore", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Total de elementos (puede ser null si no se calcula)' }),
    __metadata("design:type", Object)
], CattleBasicPageDto.prototype, "total", void 0);
//# sourceMappingURL=cattle-basic-page.dto.js.map
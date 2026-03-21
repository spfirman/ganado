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
exports.PurchaseListItemDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class PurchaseListItemDto {
}
exports.PurchaseListItemDto = PurchaseListItemDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], PurchaseListItemDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], PurchaseListItemDto.prototype, "purchaseDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ nullable: true }),
    __metadata("design:type", String)
], PurchaseListItemDto.prototype, "providerName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 12000 }),
    __metadata("design:type", Number)
], PurchaseListItemDto.prototype, "totalWeight", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 42 }),
    __metadata("design:type", Number)
], PurchaseListItemDto.prototype, "totalCattle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 38 }),
    __metadata("design:type", Number)
], PurchaseListItemDto.prototype, "receivedCattle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10980 }),
    __metadata("design:type", Number)
], PurchaseListItemDto.prototype, "receivedWeight", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'OPEN' }),
    __metadata("design:type", String)
], PurchaseListItemDto.prototype, "status", void 0);
//# sourceMappingURL=purchase-list.item.dto.js.map
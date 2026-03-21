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
exports.PurchaseResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const lot_response_dto_1 = require("./lot-response.dto");
class PurchaseResponseDto {
    static toPurchaseResponse(purchase) {
        return {
            id: purchase.id,
            idProvider: purchase.idProvider,
            purchaseDate: String(purchase.purchaseDate),
            totalCattle: purchase.totalCattle,
            totalWeight: purchase.totalWeight,
            lots: purchase.lots ? purchase.lots.map(lot_response_dto_1.LotResponseDto.toLotResponse) : [],
        };
    }
}
exports.PurchaseResponseDto = PurchaseResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '123454e1-9bba-4447-a00e-567334cc51d4', description: 'Unique identifier of the purchase' }),
    __metadata("design:type", String)
], PurchaseResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '3d1e10b-feb3-48f9-a19c-6f95e7f416bc', description: 'ID of the provider who made the sale' }),
    __metadata("design:type", String)
], PurchaseResponseDto.prototype, "idProvider", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-07-04', description: 'Date of the purchase (YYYY-MM-DD)' }),
    __metadata("design:type", String)
], PurchaseResponseDto.prototype, "purchaseDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10, description: 'Total number of cattle in the purchase' }),
    __metadata("design:type", Number)
], PurchaseResponseDto.prototype, "totalCattle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10000, description: 'Total weight (kg) of cattle in the purchase' }),
    __metadata("design:type", Number)
], PurchaseResponseDto.prototype, "totalWeight", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [lot_response_dto_1.LotResponseDto], description: 'List of lots involved in this purchase' }),
    __metadata("design:type", Array)
], PurchaseResponseDto.prototype, "lots", void 0);
//# sourceMappingURL=purchase-response.dto.js.map
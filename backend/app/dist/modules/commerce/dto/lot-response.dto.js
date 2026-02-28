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
exports.LotResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const cattle_gender_enum_1 = require("../../farm/enums/cattle-gender.enum");
class LotResponseDto {
    id;
    lotNumber;
    idPurchase;
    originPlace;
    purchasedCattleCount;
    totalWeight;
    pricePerKg;
    totalValue;
    gender;
    static toLotResponse(lot) {
        return {
            id: lot.id,
            lotNumber: lot.lotNumber,
            idPurchase: lot.idPurchase,
            originPlace: lot.originPlace,
            purchasedCattleCount: lot.purchasedCattleCount,
            totalWeight: lot.totalWeight,
            pricePerKg: lot.pricePerKg,
            totalValue: lot.totalValue,
            gender: lot.gender
        };
    }
}
exports.LotResponseDto = LotResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '111454e1-9bba-4447-a00e-567334cc51d4', description: 'Unique identifier of the lot' }),
    __metadata("design:type", String)
], LotResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'L-001', description: 'Lot number or label' }),
    __metadata("design:type", String)
], LotResponseDto.prototype, "lotNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '123454e1-9bba-4447-a00e-567334cc51d4', description: 'Unique identifier of the purchase' }),
    __metadata("design:type", String)
], LotResponseDto.prototype, "idPurchase", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Farm A - Zone 3', description: 'Lot origin place' }),
    __metadata("design:type", String)
], LotResponseDto.prototype, "originPlace", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 12, description: 'Number of cattle in the lot' }),
    __metadata("design:type", Number)
], LotResponseDto.prototype, "purchasedCattleCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 840.5, description: 'Total weight (kg) of cattle in the lot' }),
    __metadata("design:type", Number)
], LotResponseDto.prototype, "totalWeight", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 6500, description: 'Price per kilogram in the lot' }),
    __metadata("design:type", Number)
], LotResponseDto.prototype, "pricePerKg", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5460000, description: 'Total monetary value of the lot' }),
    __metadata("design:type", Number)
], LotResponseDto.prototype, "totalValue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Male', description: 'Sex of the cattle in the lot' }),
    __metadata("design:type", String)
], LotResponseDto.prototype, "gender", void 0);
//# sourceMappingURL=lot-response.dto.js.map
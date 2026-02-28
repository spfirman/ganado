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
exports.CreateCattleDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const cattle_gender_enum_1 = require("../enums/cattle-gender.enum");
const cattle_entity_1 = require("../entities/cattle.entity");
class CreateCattleDto {
    idTenant;
    idDevice;
    deveui;
    sysNumber;
    number;
    brand;
    receivedAt;
    receivedWeight;
    purchaseWeight;
    comments;
    purchasedFrom;
    purchasePrice;
    purchaseCommission;
    negotiatedPricePerKg;
    lotPricePerWeight;
    salePrice;
    salePricePerKg;
    saleWeight;
    averageGr;
    color;
    characteristics;
    hasHorn;
    castrated;
    eartagLeft;
    eartagRight;
    idLot;
    gender;
    status;
    birthDateAprx;
    newFeedStartDate;
    averageDailyGain;
    lastWeight;
}
exports.CreateCattleDto = CreateCattleDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateCattleDto.prototype, "idDevice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCattleDto.prototype, "deveui", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: true }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], CreateCattleDto.prototype, "sysNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: true }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], CreateCattleDto.prototype, "number", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCattleDto.prototype, "brand", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: true }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateCattleDto.prototype, "receivedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: true }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateCattleDto.prototype, "receivedWeight", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: true }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateCattleDto.prototype, "purchaseWeight", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCattleDto.prototype, "comments", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCattleDto.prototype, "purchasedFrom", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: true }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateCattleDto.prototype, "purchasePrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateCattleDto.prototype, "purchaseCommission", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateCattleDto.prototype, "negotiatedPricePerKg", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateCattleDto.prototype, "lotPricePerWeight", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateCattleDto.prototype, "salePrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateCattleDto.prototype, "salePricePerKg", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateCattleDto.prototype, "saleWeight", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateCattleDto.prototype, "averageGr", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCattleDto.prototype, "color", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateCattleDto.prototype, "characteristics", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateCattleDto.prototype, "hasHorn", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateCattleDto.prototype, "castrated", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCattleDto.prototype, "eartagLeft", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCattleDto.prototype, "eartagRight", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCattleDto.prototype, "idLot", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, enum: cattle_gender_enum_1.CattleGender }),
    (0, class_validator_1.IsEnum)(cattle_gender_enum_1.CattleGender),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCattleDto.prototype, "gender", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, enum: cattle_entity_1.CattleStatus }),
    (0, class_validator_1.IsEnum)(cattle_entity_1.CattleStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCattleDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCattleDto.prototype, "birthDateAprx", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: 'Fecha en que la res inicia con la nueva alimentación' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCattleDto.prototype, "newFeedStartDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: 'Ganancia diaria promedio (kg/día)' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateCattleDto.prototype, "averageDailyGain", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: true }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateCattleDto.prototype, "lastWeight", void 0);
//# sourceMappingURL=create-cattle.dto.js.map
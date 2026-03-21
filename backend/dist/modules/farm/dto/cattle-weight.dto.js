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
exports.BulkUpdateCattleStatusDto = exports.UpdateCattleWeightDto = exports.RecordWeightDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const cattle_weight_history_entity_1 = require("../entities/cattle-weight-history.entity");
class RecordWeightDto {
}
exports.RecordWeightDto = RecordWeightDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 450.5, description: 'Weight in kilograms' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], RecordWeightDto.prototype, "weight", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-12-07T20:00:00Z', description: 'Date when weight was measured' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RecordWeightDto.prototype, "measuredDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'SALE', enum: cattle_weight_history_entity_1.WeightContext, description: 'Context of measurement' }),
    (0, class_validator_1.IsEnum)(cattle_weight_history_entity_1.WeightContext),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RecordWeightDto.prototype, "context", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'uuid', description: 'ID of user who recorded' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], RecordWeightDto.prototype, "measuredBy", void 0);
class UpdateCattleWeightDto {
}
exports.UpdateCattleWeightDto = UpdateCattleWeightDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 450.5, description: 'New weight in kilograms' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], UpdateCattleWeightDto.prototype, "weight", void 0);
class BulkUpdateCattleStatusDto {
}
exports.BulkUpdateCattleStatusDto = BulkUpdateCattleStatusDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: ['uuid1', 'uuid2'], description: 'Array of cattle IDs' }),
    (0, class_validator_1.IsUUID)('4', { each: true }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Array)
], BulkUpdateCattleStatusDto.prototype, "cattleIds", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'SOLD', description: 'New status' }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], BulkUpdateCattleStatusDto.prototype, "status", void 0);
//# sourceMappingURL=cattle-weight.dto.js.map
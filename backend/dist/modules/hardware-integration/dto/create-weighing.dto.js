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
exports.WeighingQueryDto = exports.BatchSyncWeighingDto = exports.UpdateWeighingDto = exports.CreateWeighingDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const weighing_source_enum_1 = require("../enums/weighing-source.enum");
class CreateWeighingDto {
}
exports.CreateWeighingDto = CreateWeighingDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Cattle UUID' }),
    (0, class_validator_1.IsUUID)('all'),
    __metadata("design:type", String)
], CreateWeighingDto.prototype, "idCattle", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: '15-digit ISO 11784/11785 EID tag read by RFID reader' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateWeighingDto.prototype, "eidTag", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Gross weight in kg' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateWeighingDto.prototype, "grossWeightKg", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Net weight in kg (gross - tare)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateWeighingDto.prototype, "netWeightKg", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Tare weight in kg' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateWeighingDto.prototype, "tareKg", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Timestamp when scale reading stabilized' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateWeighingDto.prototype, "stableAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Operator user UUID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('all'),
    __metadata("design:type", String)
], CreateWeighingDto.prototype, "operatorId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Source of the weighing', enum: weighing_source_enum_1.WeighingSource, default: weighing_source_enum_1.WeighingSource.MANUAL }),
    (0, class_validator_1.IsEnum)(weighing_source_enum_1.WeighingSource),
    __metadata("design:type", String)
], CreateWeighingDto.prototype, "source", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Bridge device UUID that captured this weighing' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('all'),
    __metadata("design:type", String)
], CreateWeighingDto.prototype, "bridgeDeviceId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Notes or comments' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateWeighingDto.prototype, "notes", void 0);
class UpdateWeighingDto {
}
exports.UpdateWeighingDto = UpdateWeighingDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('all'),
    __metadata("design:type", String)
], UpdateWeighingDto.prototype, "idCattle", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateWeighingDto.prototype, "grossWeightKg", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateWeighingDto.prototype, "netWeightKg", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateWeighingDto.prototype, "tareKg", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateWeighingDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateWeighingDto.prototype, "eidTag", void 0);
class BatchSyncWeighingDto {
}
exports.BatchSyncWeighingDto = BatchSyncWeighingDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [CreateWeighingDto], description: 'Array of weighing records from offline bridge queue' }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CreateWeighingDto),
    __metadata("design:type", Array)
], BatchSyncWeighingDto.prototype, "records", void 0);
class WeighingQueryDto {
}
exports.WeighingQueryDto = WeighingQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('all'),
    __metadata("design:type", String)
], WeighingQueryDto.prototype, "idCattle", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('all'),
    __metadata("design:type", String)
], WeighingQueryDto.prototype, "operatorId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], WeighingQueryDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], WeighingQueryDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], WeighingQueryDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: 20 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], WeighingQueryDto.prototype, "limit", void 0);
//# sourceMappingURL=create-weighing.dto.js.map
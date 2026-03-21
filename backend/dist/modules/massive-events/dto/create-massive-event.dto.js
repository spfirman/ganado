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
exports.CreateMassiveEventDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const simple_event_type_enum_1 = require("../enums/simple-event-type.enum");
class SimpleEventInputDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tipo de evento simple',
        enum: ['weight', 'eartag', 'tracker', 'brand', 'castration', 'medication'],
        example: 'medication',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(simple_event_type_enum_1.SimpleEventType),
    __metadata("design:type", String)
], SimpleEventInputDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Datos especificos del evento simple (solo para brand o medication)',
        example: { medicationName: 'med123', dosage: '1ml/50kg', lot: '123' },
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], SimpleEventInputDto.prototype, "data", void 0);
class CreateMassiveEventDto {
}
exports.CreateMassiveEventDto = CreateMassiveEventDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Fecha del evento masivo',
        example: '2025-07-24',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateMassiveEventDto.prototype, "eventDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Lista inicial de simpleEvents (puede ir vacia)',
        type: [SimpleEventInputDto],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => SimpleEventInputDto),
    __metadata("design:type", Array)
], CreateMassiveEventDto.prototype, "simpleEvents", void 0);
//# sourceMappingURL=create-massive-event.dto.js.map
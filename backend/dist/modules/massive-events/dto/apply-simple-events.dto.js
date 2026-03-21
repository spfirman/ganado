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
exports.ApplySimpleEventsDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const simple_event_type_enum_1 = require("../enums/simple-event-type.enum");
class SingleEventDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'C-001', description: 'Cattle number to apply the event' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SingleEventDto.prototype, "cattleNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['weight', 'eartag', 'tracker', 'brand', 'castration'], example: 'weight' }),
    (0, class_validator_1.IsEnum)(simple_event_type_enum_1.SimpleEventType),
    __metadata("design:type", String)
], SingleEventDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Event-specific data' }),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], SingleEventDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: 'Optional appliedBy user id' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SingleEventDto.prototype, "appliedBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: 'Applied at' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], SingleEventDto.prototype, "appliedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: true, description: 'Massive event id to link (idMassiveEvent)' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SingleEventDto.prototype, "idMassiveEvent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: true, description: 'Simple event id to link (idSimpleEvent)' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SingleEventDto.prototype, "idSimpleEvent", void 0);
class ApplySimpleEventsDto {
}
exports.ApplySimpleEventsDto = ApplySimpleEventsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [SingleEventDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => SingleEventDto),
    __metadata("design:type", Array)
], ApplySimpleEventsDto.prototype, "events", void 0);
//# sourceMappingURL=apply-simple-events.dto.js.map
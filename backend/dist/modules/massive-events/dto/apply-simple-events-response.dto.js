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
exports.ApplySimpleEventsResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const simple_event_type_enum_1 = require("../enums/simple-event-type.enum");
class ApplySimpleEventsResponseDto {
}
exports.ApplySimpleEventsResponseDto = ApplySimpleEventsResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid', description: 'id' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ApplySimpleEventsResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid', description: 'idTenant' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ApplySimpleEventsResponseDto.prototype, "idTenant", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid', description: 'idAnimal' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ApplySimpleEventsResponseDto.prototype, "idAnimal", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'C-001', description: 'Cattle number to apply the event' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ApplySimpleEventsResponseDto.prototype, "animalNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'weight', description: 'Event type', enum: simple_event_type_enum_1.SimpleEventType }),
    (0, class_validator_1.IsEnum)(simple_event_type_enum_1.SimpleEventType),
    __metadata("design:type", String)
], ApplySimpleEventsResponseDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Event-specific data' }),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], ApplySimpleEventsResponseDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: 'Optional appliedBy user id' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ApplySimpleEventsResponseDto.prototype, "appliedBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2021-01-01', description: 'Applied at' }),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], ApplySimpleEventsResponseDto.prototype, "appliedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: true, description: 'Massive event id to link (idMassiveEvent)' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ApplySimpleEventsResponseDto.prototype, "idMassiveEvent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: true, description: 'Simple event id to link (idSimpleEvent)' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ApplySimpleEventsResponseDto.prototype, "idSimpleEvent", void 0);
//# sourceMappingURL=apply-simple-events-response.dto.js.map
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
exports.SyncMassiveEventsResponseDto = exports.SyncMassiveEventResultDto = exports.SyncMassiveEventsRequestDto = exports.SyncMassiveEventDto = exports.SyncSimpleEventInputDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const simple_event_type_enum_1 = require("../enums/simple-event-type.enum");
class SyncSimpleEventInputDto {
    id;
    type;
    dataJson;
    createdAt;
}
exports.SyncSimpleEventInputDto = SyncSimpleEventInputDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'UUID of simpleEvent (generated in frontend)',
        example: 'uuid-simple-event-123',
    }),
    __metadata("design:type", String)
], SyncSimpleEventInputDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Simple event type',
        enum: ['weight', 'eartag', 'tracker', 'brand', 'castration', 'medication'],
        example: 'medication',
    }),
    (0, class_validator_1.IsEnum)(simple_event_type_enum_1.SimpleEventType),
    __metadata("design:type", String)
], SyncSimpleEventInputDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Specific data of simple event (JSON)',
        example: '{"medicationName":"m1","dosage":"1ml","route":"oral","lot":"123"}',
    }),
    __metadata("design:type", String)
], SyncSimpleEventInputDto.prototype, "dataJson", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Creation date',
        example: '2025-07-24T10:00:00Z',
    }),
    __metadata("design:type", String)
], SyncSimpleEventInputDto.prototype, "createdAt", void 0);
class SyncMassiveEventDto {
    id;
    idTenant;
    eventDate;
    status;
    createdBy;
    createdAt;
    updatedAt;
    simpleEvents;
}
exports.SyncMassiveEventDto = SyncMassiveEventDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'UUID of massiveEvent (generated in frontend)',
        example: 'uuid-massive-event-123',
    }),
    __metadata("design:type", String)
], SyncMassiveEventDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'UUID of tenant',
        example: 'tenant-uuid',
    }),
    __metadata("design:type", String)
], SyncMassiveEventDto.prototype, "idTenant", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Event date',
        example: '2025-07-24T00:00:00Z',
    }),
    __metadata("design:type", String)
], SyncMassiveEventDto.prototype, "eventDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Status',
        example: 'open',
    }),
    __metadata("design:type", String)
], SyncMassiveEventDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Creator user',
        example: 'user-uuid-123',
    }),
    __metadata("design:type", String)
], SyncMassiveEventDto.prototype, "createdBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Creation date',
        example: '2025-07-24T00:00:00Z',
    }),
    __metadata("design:type", String)
], SyncMassiveEventDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Update date',
        example: '2025-07-24T00:00:00Z',
    }),
    __metadata("design:type", String)
], SyncMassiveEventDto.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'List of simpleEvents to synchronize',
        type: [SyncSimpleEventInputDto],
    }),
    __metadata("design:type", Array)
], SyncMassiveEventDto.prototype, "simpleEvents", void 0);
class SyncMassiveEventsRequestDto {
    massiveEvents;
}
exports.SyncMassiveEventsRequestDto = SyncMassiveEventsRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [SyncMassiveEventDto] }),
    __metadata("design:type", Array)
], SyncMassiveEventsRequestDto.prototype, "massiveEvents", void 0);
class SyncMassiveEventResultDto {
    id;
    status;
    message;
}
exports.SyncMassiveEventResultDto = SyncMassiveEventResultDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SyncMassiveEventResultDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'synced' }),
    __metadata("design:type", String)
], SyncMassiveEventResultDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Additional message if applies' }),
    __metadata("design:type", String)
], SyncMassiveEventResultDto.prototype, "message", void 0);
class SyncMassiveEventsResponseDto {
    results;
}
exports.SyncMassiveEventsResponseDto = SyncMassiveEventsResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [SyncMassiveEventResultDto] }),
    __metadata("design:type", Array)
], SyncMassiveEventsResponseDto.prototype, "results", void 0);
//# sourceMappingURL=sync-massive-event.dto.js.map
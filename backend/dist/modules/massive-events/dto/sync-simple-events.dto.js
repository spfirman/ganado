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
exports.SyncSimpleEventsResponseDto = exports.SyncSimpleEventResultDto = exports.SyncSimpleEventsRequestDto = exports.SyncSimpleEventDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const simple_event_type_enum_1 = require("../enums/simple-event-type.enum");
class SyncSimpleEventDto {
    id;
    idTenant;
    massiveEventServerId;
    type;
    dataJson;
    isActive;
    createdAt;
    createdBy;
}
exports.SyncSimpleEventDto = SyncSimpleEventDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-local-simple-event' }),
    __metadata("design:type", String)
], SyncSimpleEventDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'tenant-uuid' }),
    __metadata("design:type", String)
], SyncSimpleEventDto.prototype, "idTenant", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-existing-massive-event' }),
    __metadata("design:type", String)
], SyncSimpleEventDto.prototype, "massiveEventServerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'medication' }),
    (0, class_validator_1.IsEnum)(simple_event_type_enum_1.SimpleEventType),
    __metadata("design:type", String)
], SyncSimpleEventDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '{"medicationName":"m1","dosage":10,"lot":"123"}', required: false }),
    __metadata("design:type", String)
], SyncSimpleEventDto.prototype, "dataJson", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true, required: false }),
    __metadata("design:type", Boolean)
], SyncSimpleEventDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-07-24T12:00:00Z', required: false }),
    __metadata("design:type", String)
], SyncSimpleEventDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'user-123', required: false }),
    __metadata("design:type", String)
], SyncSimpleEventDto.prototype, "createdBy", void 0);
class SyncSimpleEventsRequestDto {
    simpleEvents;
}
exports.SyncSimpleEventsRequestDto = SyncSimpleEventsRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [SyncSimpleEventDto] }),
    __metadata("design:type", Array)
], SyncSimpleEventsRequestDto.prototype, "simpleEvents", void 0);
class SyncSimpleEventResultDto {
    id;
    status;
    serverId;
    message;
}
exports.SyncSimpleEventResultDto = SyncSimpleEventResultDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-local-simple-event' }),
    __metadata("design:type", String)
], SyncSimpleEventResultDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'synced' }),
    __metadata("design:type", String)
], SyncSimpleEventResultDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-simple-event-backend' }),
    __metadata("design:type", String)
], SyncSimpleEventResultDto.prototype, "serverId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Optional message', required: false }),
    __metadata("design:type", String)
], SyncSimpleEventResultDto.prototype, "message", void 0);
class SyncSimpleEventsResponseDto {
    results;
}
exports.SyncSimpleEventsResponseDto = SyncSimpleEventsResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [SyncSimpleEventResultDto] }),
    __metadata("design:type", Array)
], SyncSimpleEventsResponseDto.prototype, "results", void 0);
//# sourceMappingURL=sync-simple-events.dto.js.map
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
exports.SyncAnimalSimpleEventResponseDto = exports.SyncAnimalSimpleEventResultDto = exports.SyncAnimalSimpleEventRequestDto = exports.SyncAnimalSimpleEventDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class SyncAnimalSimpleEventDto {
    id;
    idTenant;
    cattleNumber;
    type;
    dataJson;
    appliedAt;
    appliedBy;
    idMassiveEvent;
    idSimpleEvent;
}
exports.SyncAnimalSimpleEventDto = SyncAnimalSimpleEventDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-local-animal-simple-event' }),
    __metadata("design:type", String)
], SyncAnimalSimpleEventDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'tenant-uuid' }),
    __metadata("design:type", String)
], SyncAnimalSimpleEventDto.prototype, "idTenant", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'C-123' }),
    __metadata("design:type", String)
], SyncAnimalSimpleEventDto.prototype, "cattleNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'weight' }),
    __metadata("design:type", String)
], SyncAnimalSimpleEventDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '{"weight":350}', required: false }),
    __metadata("design:type", String)
], SyncAnimalSimpleEventDto.prototype, "dataJson", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-07-24T10:00:00Z' }),
    __metadata("design:type", String)
], SyncAnimalSimpleEventDto.prototype, "appliedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'user-123', required: false }),
    __metadata("design:type", String)
], SyncAnimalSimpleEventDto.prototype, "appliedBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-massive-event', required: false }),
    __metadata("design:type", String)
], SyncAnimalSimpleEventDto.prototype, "idMassiveEvent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-simple-event', required: false }),
    __metadata("design:type", String)
], SyncAnimalSimpleEventDto.prototype, "idSimpleEvent", void 0);
class SyncAnimalSimpleEventRequestDto {
    animalSimpleEvent;
}
exports.SyncAnimalSimpleEventRequestDto = SyncAnimalSimpleEventRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [SyncAnimalSimpleEventDto] }),
    __metadata("design:type", Array)
], SyncAnimalSimpleEventRequestDto.prototype, "animalSimpleEvent", void 0);
class SyncAnimalSimpleEventResultDto {
    id;
    status;
    animalServerId;
    message;
}
exports.SyncAnimalSimpleEventResultDto = SyncAnimalSimpleEventResultDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SyncAnimalSimpleEventResultDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'synced' }),
    __metadata("design:type", String)
], SyncAnimalSimpleEventResultDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-animal-real', required: false }),
    __metadata("design:type", String)
], SyncAnimalSimpleEventResultDto.prototype, "animalServerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Animal number not found', required: false }),
    __metadata("design:type", String)
], SyncAnimalSimpleEventResultDto.prototype, "message", void 0);
class SyncAnimalSimpleEventResponseDto {
    results;
}
exports.SyncAnimalSimpleEventResponseDto = SyncAnimalSimpleEventResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [SyncAnimalSimpleEventResultDto] }),
    __metadata("design:type", Array)
], SyncAnimalSimpleEventResponseDto.prototype, "results", void 0);
//# sourceMappingURL=sync-animal-simple-event.dto.js.map
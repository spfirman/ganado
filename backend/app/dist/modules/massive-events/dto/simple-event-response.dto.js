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
exports.SimpleEventResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class SimpleEventResponseDto {
    id;
    idTenant;
    type;
    idMassiveEvent;
    createdAt;
    data;
    isActive;
    static toResponseDto(entity) {
        return {
            id: entity.id,
            idTenant: entity.idTenant,
            idMassiveEvent: entity.idMassiveEvent,
            type: entity.type,
            data: entity.data,
            createdAt: entity.createdAt,
            isActive: entity.isActive,
        };
    }
}
exports.SimpleEventResponseDto = SimpleEventResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-simple-event', description: 'Unique ID of the simple event' }),
    __metadata("design:type", String)
], SimpleEventResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-tenant', description: 'ID of the tenant' }),
    __metadata("design:type", String)
], SimpleEventResponseDto.prototype, "idTenant", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'medication', description: 'Type of simple event' }),
    __metadata("design:type", String)
], SimpleEventResponseDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-massive-event', description: 'Massive event ID this simple event belongs to' }),
    __metadata("design:type", String)
], SimpleEventResponseDto.prototype, "idMassiveEvent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-07-24T12:00:00Z', description: 'Date when the simple event was created' }),
    __metadata("design:type", Date)
], SimpleEventResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "{  medicationName: 'med123', dosage: '1ml/50kg', lot: '123' }" }),
    __metadata("design:type", String)
], SimpleEventResponseDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true, description: 'Whether the simple event is active' }),
    __metadata("design:type", Boolean)
], SimpleEventResponseDto.prototype, "isActive", void 0);
//# sourceMappingURL=simple-event-response.dto.js.map
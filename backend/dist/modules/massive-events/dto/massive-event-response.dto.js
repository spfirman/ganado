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
exports.MassiveEventResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const simple_event_response_dto_1 = require("./simple-event-response.dto");
class MassiveEventResponseDto {
    id;
    idTenant;
    status;
    eventDate;
    createdAt;
    updatedAt;
    simpleEvents;
    static toResponseDto(entity, simpleEvents) {
        return {
            id: entity.id,
            idTenant: entity.idTenant,
            status: entity.status,
            eventDate: entity.eventDate,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
            simpleEvents: simpleEvents
                ? simpleEvents.map(simple_event_response_dto_1.SimpleEventResponseDto.toResponseDto)
                : [],
        };
    }
}
exports.MassiveEventResponseDto = MassiveEventResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-massive-event', description: 'Unique ID of the massive event' }),
    __metadata("design:type", String)
], MassiveEventResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-tenant', description: 'Tenant identifier' }),
    __metadata("design:type", String)
], MassiveEventResponseDto.prototype, "idTenant", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'open', description: 'Status of the massive event' }),
    __metadata("design:type", String)
], MassiveEventResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2022-01-01', description: 'Event date' }),
    __metadata("design:type", Date)
], MassiveEventResponseDto.prototype, "eventDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-07-24T12:00:00Z', description: 'Date when the massive event was created' }),
    __metadata("design:type", Date)
], MassiveEventResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-07-24T12:00:00Z', description: 'Date when the massive event was last updated' }),
    __metadata("design:type", Date)
], MassiveEventResponseDto.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [simple_event_response_dto_1.SimpleEventResponseDto],
        description: 'List of simple events associated with this massive event',
    }),
    __metadata("design:type", Array)
], MassiveEventResponseDto.prototype, "simpleEvents", void 0);
//# sourceMappingURL=massive-event-response.dto.js.map
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
exports.ReceiveCattleResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class ReceiveCattleResponseDto {
    static toResponseDto(cattle, appliedEvents) {
        return {
            id: cattle.id,
            idTenant: cattle.idTenant,
            sysnumber: cattle.sysNumber,
            number: cattle.number,
            idLot: cattle.idLot ?? undefined,
            idBrand: cattle.idBrand ?? undefined,
            color: cattle.color ?? undefined,
            idDevice: cattle.idDevice ?? undefined,
            eartagLeft: cattle.eartagLeft ?? undefined,
            eartagRight: cattle.eartagRight ?? undefined,
            deviceName: cattle.device?.name ?? undefined,
            appliedEvents: appliedEvents ?? [],
        };
    }
}
exports.ReceiveCattleResponseDto = ReceiveCattleResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid', description: 'id' }),
    __metadata("design:type", String)
], ReceiveCattleResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid', description: 'idTenant' }),
    __metadata("design:type", String)
], ReceiveCattleResponseDto.prototype, "idTenant", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'C-001', description: 'sysnumber' }),
    __metadata("design:type", String)
], ReceiveCattleResponseDto.prototype, "sysnumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'C-001', description: 'number' }),
    __metadata("design:type", String)
], ReceiveCattleResponseDto.prototype, "number", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid', description: 'idLot' }),
    __metadata("design:type", String)
], ReceiveCattleResponseDto.prototype, "idLot", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid', description: 'idBrand' }),
    __metadata("design:type", String)
], ReceiveCattleResponseDto.prototype, "idBrand", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'color_enum', description: 'color' }),
    __metadata("design:type", String)
], ReceiveCattleResponseDto.prototype, "color", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid', description: 'idDevice' }),
    __metadata("design:type", String)
], ReceiveCattleResponseDto.prototype, "idDevice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'C-001', description: 'eartagLeft' }),
    __metadata("design:type", String)
], ReceiveCattleResponseDto.prototype, "eartagLeft", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'C-002', description: 'eartagRight' }),
    __metadata("design:type", String)
], ReceiveCattleResponseDto.prototype, "eartagRight", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Tracker 1', description: 'deviceName' }),
    __metadata("design:type", String)
], ReceiveCattleResponseDto.prototype, "deviceName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'appliedEvents', description: 'appliedEvents' }),
    __metadata("design:type", Array)
], ReceiveCattleResponseDto.prototype, "appliedEvents", void 0);
//# sourceMappingURL=receive-cattle-response.dto.js.map
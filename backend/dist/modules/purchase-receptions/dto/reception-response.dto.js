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
exports.ReceptionResponseDto = exports.PurchaseReceptionResponseDto = exports.ReceptionMassiveEventResponseDto = exports.LotReceptionResponseDto = exports.CattleReceptionResponseDto = exports.AnimalSimpleEventReceptionResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const simple_event_response_dto_1 = require("../../massive-events/dto/simple-event-response.dto");
class AnimalSimpleEventReceptionResponseDto {
    static toResponseDto(entity) {
        return {
            id: entity.id,
            data: entity.data,
            appliedAt: entity.appliedAt.toISOString(),
        };
    }
}
exports.AnimalSimpleEventReceptionResponseDto = AnimalSimpleEventReceptionResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ format: 'uuid', description: 'ID del evento simple' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], AnimalSimpleEventReceptionResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: { kg: 420 }, description: 'Datos del evento' }),
    __metadata("design:type", Object)
], AnimalSimpleEventReceptionResponseDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-01-01', description: 'Fecha de aplicacion' }),
    __metadata("design:type", String)
], AnimalSimpleEventReceptionResponseDto.prototype, "appliedAt", void 0);
class CattleReceptionResponseDto {
    static toResponseDto(entity, appliedEvents) {
        return {
            id: entity.id,
            number: entity.number,
            sysNumber: entity.sysNumber,
            receivedWeight: entity.receivedWeight,
            idDevice: entity.idDevice ?? '',
            deviceName: entity.device?.name ?? '-',
            eartagLeft: entity.eartagLeft ?? undefined,
            eartagRight: entity.eartagRight ?? undefined,
            appliedEvents: appliedEvents.map(AnimalSimpleEventReceptionResponseDto.toResponseDto),
        };
    }
}
exports.CattleReceptionResponseDto = CattleReceptionResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ format: 'uuid', description: 'ID del animal' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CattleReceptionResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '1234', description: 'Numero de res' }),
    __metadata("design:type", String)
], CattleReceptionResponseDto.prototype, "number", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '1234', description: 'Numero de sistema de la res' }),
    __metadata("design:type", String)
], CattleReceptionResponseDto.prototype, "sysNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 420, description: 'Peso (kg) del animal recibido' }),
    __metadata("design:type", Number)
], CattleReceptionResponseDto.prototype, "receivedWeight", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '1234', description: 'ID del dispositivo' }),
    __metadata("design:type", String)
], CattleReceptionResponseDto.prototype, "idDevice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Dispositivo 1', description: 'Nombre del dispositivo' }),
    __metadata("design:type", String)
], CattleReceptionResponseDto.prototype, "deviceName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '1234', description: 'Arete/Caravana izquierda del animal' }),
    __metadata("design:type", String)
], CattleReceptionResponseDto.prototype, "eartagLeft", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '5678', description: 'Arete/Caravana derecha del animal' }),
    __metadata("design:type", String)
], CattleReceptionResponseDto.prototype, "eartagRight", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: [{ id: '1234', type: 'weight', data: { kg: 420 }, appliedAt: '2025-01-01' }],
        description: 'Eventos simples aplicados',
    }),
    __metadata("design:type", Array)
], CattleReceptionResponseDto.prototype, "appliedEvents", void 0);
class LotReceptionResponseDto {
    static toResponseDto(entity, lotCattle, appliedEvents) {
        var cattles = [];
        for (const c of lotCattle) {
            cattles.push(CattleReceptionResponseDto.toResponseDto(c, appliedEvents[c.id]));
        }
        return {
            id: entity.id,
            lotNumber: entity.lotNumber,
            purchasedCattleCount: entity.purchasedCattleCount,
            totalWeight: entity.totalWeight,
            pricePerKg: entity.pricePerKg,
            receivedCattleCount: entity.receivedCattleCount,
            receivedTotalWeight: entity.receivedTotalWeight,
            cattle: cattles,
        };
    }
}
exports.LotReceptionResponseDto = LotReceptionResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ format: 'uuid', description: 'ID del lote' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], LotReceptionResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'L-001', description: 'Lot number or label' }),
    __metadata("design:type", String)
], LotReceptionResponseDto.prototype, "lotNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 12, description: 'Number of cattle in the lot' }),
    __metadata("design:type", Number)
], LotReceptionResponseDto.prototype, "purchasedCattleCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 8500, description: 'Price per kg of cattle in the lot' }),
    __metadata("design:type", Number)
], LotReceptionResponseDto.prototype, "pricePerKg", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 840.5, description: 'Total weight (kg) of cattle in the lot' }),
    __metadata("design:type", Number)
], LotReceptionResponseDto.prototype, "totalWeight", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 12, description: 'Number of cattle received in the lot' }),
    __metadata("design:type", Number)
], LotReceptionResponseDto.prototype, "receivedCattleCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 840.5, description: 'Total weight (kg) of cattle received in the lot' }),
    __metadata("design:type", Number)
], LotReceptionResponseDto.prototype, "receivedTotalWeight", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [CattleReceptionResponseDto], description: 'List of cattle involved in this lot' }),
    __metadata("design:type", Array)
], LotReceptionResponseDto.prototype, "cattle", void 0);
class ReceptionMassiveEventResponseDto {
    static toResponseDto(entity) {
        return {
            id: entity.id,
            status: entity.status,
            simpleEvents: entity.simpleEvents.map(simple_event_response_dto_1.SimpleEventResponseDto.toResponseDto),
        };
    }
}
exports.ReceptionMassiveEventResponseDto = ReceptionMassiveEventResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ format: 'uuid', description: 'ID del evento masivo' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], ReceptionMassiveEventResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [simple_event_response_dto_1.SimpleEventResponseDto], description: 'List of simple events involved in this massive event' }),
    __metadata("design:type", Array)
], ReceptionMassiveEventResponseDto.prototype, "simpleEvents", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'open', description: 'Status of the massive event' }),
    __metadata("design:type", String)
], ReceptionMassiveEventResponseDto.prototype, "status", void 0);
class PurchaseReceptionResponseDto {
    static toResponseDto(entity, purchase, providerName, lots, lotCattle, cattle, appliedEvents, massiveEvent) {
        var receivedCattleCount = 0;
        var receivedTotalWeight = 0;
        var purchaseCattleCount = 0;
        var purchaseTotalWeight = 0;
        var responseLots = [];
        for (const l of lots ?? []) {
            responseLots.push(LotReceptionResponseDto.toResponseDto(l, lotCattle[l.id], appliedEvents));
            receivedCattleCount += l.receivedCattleCount;
            receivedTotalWeight += l.receivedTotalWeight;
            purchaseCattleCount += l.purchasedCattleCount;
            purchaseTotalWeight += l.totalWeight;
        }
        var responseCattle = [];
        for (const c of cattle ?? []) {
            responseCattle.push(CattleReceptionResponseDto.toResponseDto(c, appliedEvents[c.id]));
            receivedCattleCount += 1;
            receivedTotalWeight += c.receivedWeight;
        }
        return {
            id: entity.id,
            purchaseId: entity.idPurchase,
            providerId: purchase?.idProvider,
            purchaseDate: new Date(purchase?.purchaseDate).toISOString(),
            receivedAt: new Date(entity.receivedAt).toISOString(),
            purchaseProviderName: providerName,
            nextCattleNumber: entity.nextCattleNumber,
            lots: responseLots,
            cattle: responseCattle,
            massiveEvent: ReceptionMassiveEventResponseDto.toResponseDto(massiveEvent),
            receivedCattleCount: receivedCattleCount,
            receivedTotalWeight: receivedTotalWeight,
            purchaseCattleCount: purchaseCattleCount,
            purchaseTotalWeight: purchaseTotalWeight,
            purchaseStatus: purchase?.status,
            massEventId: undefined,
        };
    }
}
exports.PurchaseReceptionResponseDto = PurchaseReceptionResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ format: 'uuid', description: 'ID de la recepcion' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], PurchaseReceptionResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ format: 'uuid', description: 'ID de la compra (purchase) a la cual se asocia la recepcion' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], PurchaseReceptionResponseDto.prototype, "purchaseId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'OPEN', description: 'Status of the purchase' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PurchaseReceptionResponseDto.prototype, "purchaseStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ format: 'uuid', description: 'ID del proveedor (provider) a la cual se asocia la recepcion' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], PurchaseReceptionResponseDto.prototype, "providerId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ format: 'uuid', description: 'ID del evento masivo a crear junto con la recepcion.' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], PurchaseReceptionResponseDto.prototype, "massEventId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ format: 'number', description: 'posible next cattle number for reception' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PurchaseReceptionResponseDto.prototype, "nextCattleNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Fecha/hora efectiva de la compra.',
        type: String,
        format: 'date-time',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], PurchaseReceptionResponseDto.prototype, "purchaseDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Ganaderia El Porvenir', description: 'Name of the provider of the purchase' }),
    __metadata("design:type", String)
], PurchaseReceptionResponseDto.prototype, "purchaseProviderName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Fecha/hora efectiva de la recepcion.',
        type: String,
        format: 'date-time',
    }),
    (0, swagger_1.ApiProperty)({
        description: 'Fecha/hora efectiva de la recepcion.',
        type: String,
        format: 'date-time',
    }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], PurchaseReceptionResponseDto.prototype, "receivedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [LotReceptionResponseDto], description: 'List of lots involved in this reception' }),
    __metadata("design:type", Array)
], PurchaseReceptionResponseDto.prototype, "lots", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [CattleReceptionResponseDto], description: 'List of cattle involved in this reception' }),
    __metadata("design:type", Array)
], PurchaseReceptionResponseDto.prototype, "cattle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [ReceptionMassiveEventResponseDto], description: 'List of massive events involved in this reception' }),
    __metadata("design:type", ReceptionMassiveEventResponseDto)
], PurchaseReceptionResponseDto.prototype, "massiveEvent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 12, description: 'Number of cattle received in the lot' }),
    __metadata("design:type", Number)
], PurchaseReceptionResponseDto.prototype, "receivedCattleCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 840.5, description: 'Total weight (kg) of cattle received in the lot' }),
    __metadata("design:type", Number)
], PurchaseReceptionResponseDto.prototype, "receivedTotalWeight", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 12, description: 'Number of cattle purchased in the lot' }),
    __metadata("design:type", Number)
], PurchaseReceptionResponseDto.prototype, "purchaseCattleCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 840.5, description: 'Total weight (kg) of cattle purchased in the lot' }),
    __metadata("design:type", Number)
], PurchaseReceptionResponseDto.prototype, "purchaseTotalWeight", void 0);
class ReceptionResponseDto {
    static toResponseDto(receptionInfo) {
        return {
            reception: receptionInfo,
        };
    }
    static toResponseDto_optional(entity, purchase, providerName, lots, lotCattle, cattle, appliedEvents, massiveEvent) {
        var receptionInfo = PurchaseReceptionResponseDto.toResponseDto(entity, purchase, providerName, lots, lotCattle, cattle, appliedEvents, massiveEvent);
        return {
            reception: receptionInfo,
        };
    }
}
exports.ReceptionResponseDto = ReceptionResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: PurchaseReceptionResponseDto, description: 'Purchase reception' }),
    __metadata("design:type", PurchaseReceptionResponseDto)
], ReceptionResponseDto.prototype, "reception", void 0);
//# sourceMappingURL=reception-response.dto.js.map
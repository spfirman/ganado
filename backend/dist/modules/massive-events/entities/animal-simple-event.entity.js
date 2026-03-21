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
exports.AnimalSimpleEvent = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
let AnimalSimpleEvent = class AnimalSimpleEvent {
};
exports.AnimalSimpleEvent = AnimalSimpleEvent;
__decorate([
    (0, swagger_1.ApiProperty)({ format: 'uuid', description: 'Record ID in animal_simple_event', example: 'uuid-animal-simple-event' }),
    (0, typeorm_1.PrimaryColumn)('uuid'),
    __metadata("design:type", String)
], AnimalSimpleEvent.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ format: 'uuid', description: 'Tenant ID', example: 'uuid-tenant' }),
    (0, typeorm_1.Column)({ name: 'id_tenant', type: 'uuid' }),
    __metadata("design:type", String)
], AnimalSimpleEvent.prototype, "idTenant", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ format: 'uuid', description: 'Simple event ID', example: 'uuid-simple-event' }),
    (0, typeorm_1.Column)({ name: 'id_simple_event', type: 'uuid' }),
    __metadata("design:type", String)
], AnimalSimpleEvent.prototype, "idSimpleEvent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ format: 'uuid', description: 'Massive event ID', example: 'uuid-massive-event' }),
    (0, typeorm_1.Column)({ name: 'id_massive_event', type: 'uuid' }),
    __metadata("design:type", String)
], AnimalSimpleEvent.prototype, "idMassiveEvent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ format: 'uuid', description: 'Animal ID', example: 'uuid-animal' }),
    (0, typeorm_1.Column)({ name: 'id_animal', type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], AnimalSimpleEvent.prototype, "idAnimal", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Provisional number of the animal, if not created in the cattle table',
        example: 'TEMP-001',
        required: false,
    }),
    (0, typeorm_1.Column)({ name: 'provisional_number', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], AnimalSimpleEvent.prototype, "provisionalNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Additional data applied by the simple_event',
        example: { medication: 'ivermectina', dosage: '10ml' },
        required: false,
    }),
    (0, typeorm_1.Column)({ name: 'data', type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], AnimalSimpleEvent.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date/time when the event was applied', type: String, format: 'date-time', example: '2025-01-01T00:00:00Z' }),
    (0, typeorm_1.CreateDateColumn)({ name: 'applied_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], AnimalSimpleEvent.prototype, "appliedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: 'User ID that applied the event', example: 'uuid-user' }),
    (0, typeorm_1.Column)({ name: 'applied_by', type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], AnimalSimpleEvent.prototype, "appliedBy", void 0);
exports.AnimalSimpleEvent = AnimalSimpleEvent = __decorate([
    (0, typeorm_1.Entity)({ name: 'animal_simple_event' }),
    (0, typeorm_1.Index)(['idTenant', 'idMassiveEvent'])
], AnimalSimpleEvent);
//# sourceMappingURL=animal-simple-event.entity.js.map
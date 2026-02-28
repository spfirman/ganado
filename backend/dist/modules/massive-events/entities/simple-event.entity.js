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
exports.SimpleEvent = void 0;
const typeorm_1 = require("typeorm");
const simple_event_type_enum_1 = require("../enums/simple-event-type.enum");
const massive_events_entity_1 = require("./massive-events.entity");
let SimpleEvent = class SimpleEvent {
    id;
    idTenant;
    idMassiveEvent;
    massiveEvent;
    type;
    isActive;
    data;
    createdAt;
};
exports.SimpleEvent = SimpleEvent;
__decorate([
    (0, typeorm_1.PrimaryColumn)('uuid'),
    __metadata("design:type", String)
], SimpleEvent.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_tenant', type: 'uuid' }),
    __metadata("design:type", String)
], SimpleEvent.prototype, "idTenant", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_massive_event', type: 'uuid' }),
    __metadata("design:type", String)
], SimpleEvent.prototype, "idMassiveEvent", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => massive_events_entity_1.MassiveEvent, me => me.simpleEvents, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'id_massive_event' }),
    __metadata("design:type", massive_events_entity_1.MassiveEvent)
], SimpleEvent.prototype, "massiveEvent", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'type', type: 'enum', enum: simple_event_type_enum_1.SimpleEventType, enumName: 'simple_event_type_enum' }),
    __metadata("design:type", String)
], SimpleEvent.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], SimpleEvent.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], SimpleEvent.prototype, "data", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], SimpleEvent.prototype, "createdAt", void 0);
exports.SimpleEvent = SimpleEvent = __decorate([
    (0, typeorm_1.Entity)('simple_events')
], SimpleEvent);
//# sourceMappingURL=simple-event.entity.js.map
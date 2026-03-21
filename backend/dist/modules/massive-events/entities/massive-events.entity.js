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
exports.MassiveEvent = void 0;
const typeorm_1 = require("typeorm");
const simple_event_entity_1 = require("./simple-event.entity");
let MassiveEvent = class MassiveEvent {
};
exports.MassiveEvent = MassiveEvent;
__decorate([
    (0, typeorm_1.PrimaryColumn)('uuid'),
    __metadata("design:type", String)
], MassiveEvent.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_tenant', type: 'uuid' }),
    __metadata("design:type", String)
], MassiveEvent.prototype, "idTenant", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], MassiveEvent.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'event_date', type: 'timestamp' }),
    __metadata("design:type", Date)
], MassiveEvent.prototype, "eventDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, default: 'open' }),
    __metadata("design:type", String)
], MassiveEvent.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_by', type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], MassiveEvent.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], MassiveEvent.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], MassiveEvent.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => simple_event_entity_1.SimpleEvent, (simpleEvent) => simpleEvent.massiveEvent),
    __metadata("design:type", Array)
], MassiveEvent.prototype, "simpleEvents", void 0);
exports.MassiveEvent = MassiveEvent = __decorate([
    (0, typeorm_1.Entity)('massive_events')
], MassiveEvent);
//# sourceMappingURL=massive-events.entity.js.map
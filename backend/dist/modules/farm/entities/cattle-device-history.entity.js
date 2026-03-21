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
exports.CattleDeviceHistory = void 0;
const typeorm_1 = require("typeorm");
let CattleDeviceHistory = class CattleDeviceHistory {
};
exports.CattleDeviceHistory = CattleDeviceHistory;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], CattleDeviceHistory.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_tenant', type: 'uuid' }),
    __metadata("design:type", String)
], CattleDeviceHistory.prototype, "idTenant", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_cattle', type: 'uuid' }),
    __metadata("design:type", String)
], CattleDeviceHistory.prototype, "idCattle", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_device', type: 'uuid' }),
    __metadata("design:type", String)
], CattleDeviceHistory.prototype, "idDevice", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'assigned_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], CattleDeviceHistory.prototype, "assignedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'unassigned_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], CattleDeviceHistory.prototype, "unassignedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'assigned_by', type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], CattleDeviceHistory.prototype, "assignedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'idMassiveEvent', type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], CattleDeviceHistory.prototype, "idMassiveEvent", void 0);
exports.CattleDeviceHistory = CattleDeviceHistory = __decorate([
    (0, typeorm_1.Entity)('cattle_device_history')
], CattleDeviceHistory);
//# sourceMappingURL=cattle-device-history.entity.js.map
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
exports.CattleMedicationHistory = void 0;
const typeorm_1 = require("typeorm");
let CattleMedicationHistory = class CattleMedicationHistory {
    id;
    idTenant;
    idCattle;
    medicationName;
    route;
    dosage;
    lot;
    appliedAt;
    idMassiveEvent;
    recordedBy;
};
exports.CattleMedicationHistory = CattleMedicationHistory;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], CattleMedicationHistory.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_tenant', type: 'uuid' }),
    __metadata("design:type", String)
], CattleMedicationHistory.prototype, "idTenant", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_cattle', type: 'uuid' }),
    __metadata("design:type", String)
], CattleMedicationHistory.prototype, "idCattle", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'medication_name', type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], CattleMedicationHistory.prototype, "medicationName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], CattleMedicationHistory.prototype, "route", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'dosage', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], CattleMedicationHistory.prototype, "dosage", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], CattleMedicationHistory.prototype, "lot", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'applied_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], CattleMedicationHistory.prototype, "appliedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'idMassiveEvent', type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], CattleMedicationHistory.prototype, "idMassiveEvent", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'recorded_by', type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], CattleMedicationHistory.prototype, "recordedBy", void 0);
exports.CattleMedicationHistory = CattleMedicationHistory = __decorate([
    (0, typeorm_1.Entity)('cattle_medication_history')
], CattleMedicationHistory);
//# sourceMappingURL=cattle-medication-history.entity.js.map
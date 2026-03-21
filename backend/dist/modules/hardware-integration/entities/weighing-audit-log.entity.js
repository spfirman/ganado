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
exports.WeighingAuditLog = void 0;
const typeorm_1 = require("typeorm");
let WeighingAuditLog = class WeighingAuditLog {
};
exports.WeighingAuditLog = WeighingAuditLog;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], WeighingAuditLog.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_tenant', type: 'uuid' }),
    __metadata("design:type", String)
], WeighingAuditLog.prototype, "idTenant", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'weighing_id', type: 'uuid' }),
    __metadata("design:type", String)
], WeighingAuditLog.prototype, "weighingId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'field_changed', type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], WeighingAuditLog.prototype, "fieldChanged", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'old_value', type: 'text', nullable: true }),
    __metadata("design:type", String)
], WeighingAuditLog.prototype, "oldValue", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'new_value', type: 'text', nullable: true }),
    __metadata("design:type", String)
], WeighingAuditLog.prototype, "newValue", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'changed_by', type: 'uuid' }),
    __metadata("design:type", String)
], WeighingAuditLog.prototype, "changedBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'changed_at' }),
    __metadata("design:type", Date)
], WeighingAuditLog.prototype, "changedAt", void 0);
exports.WeighingAuditLog = WeighingAuditLog = __decorate([
    (0, typeorm_1.Entity)('weighing_audit_log')
], WeighingAuditLog);
//# sourceMappingURL=weighing-audit-log.entity.js.map
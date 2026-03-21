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
exports.CattleWeightHistory = exports.WeightContext = void 0;
const typeorm_1 = require("typeorm");
var WeightContext;
(function (WeightContext) {
    WeightContext["SALE"] = "SALE";
    WeightContext["PURCHASE"] = "PURCHASE";
    WeightContext["EVENT"] = "EVENT";
    WeightContext["MANUAL"] = "MANUAL";
    WeightContext["RECEIVED"] = "RECEIVED";
})(WeightContext || (exports.WeightContext = WeightContext = {}));
let CattleWeightHistory = class CattleWeightHistory {
};
exports.CattleWeightHistory = CattleWeightHistory;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], CattleWeightHistory.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_tenant', type: 'uuid' }),
    __metadata("design:type", String)
], CattleWeightHistory.prototype, "idTenant", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_cattle', type: 'uuid' }),
    __metadata("design:type", String)
], CattleWeightHistory.prototype, "idCattle", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'numeric', precision: 6, scale: 2 }),
    __metadata("design:type", Number)
], CattleWeightHistory.prototype, "weight", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], CattleWeightHistory.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: WeightContext,
        default: WeightContext.MANUAL,
    }),
    __metadata("design:type", String)
], CattleWeightHistory.prototype, "context", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'idMassiveEvent', type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], CattleWeightHistory.prototype, "idMassiveEvent", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'recorded_by', type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], CattleWeightHistory.prototype, "recordedBy", void 0);
exports.CattleWeightHistory = CattleWeightHistory = __decorate([
    (0, typeorm_1.Entity)('cattle_weight_history')
], CattleWeightHistory);
//# sourceMappingURL=cattle-weight-history.entity.js.map
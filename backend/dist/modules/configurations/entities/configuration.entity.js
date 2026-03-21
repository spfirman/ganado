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
exports.Configuration = void 0;
const typeorm_1 = require("typeorm");
let Configuration = class Configuration {
};
exports.Configuration = Configuration;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Configuration.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_tenant', type: 'uuid', nullable: false }),
    __metadata("design:type", String)
], Configuration.prototype, "idTenant", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'code', type: 'varchar', nullable: false }),
    __metadata("design:type", String)
], Configuration.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_system_config', type: 'boolean', nullable: false }),
    __metadata("design:type", Boolean)
], Configuration.prototype, "isSystemConfig", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'name', type: 'varchar', nullable: false }),
    __metadata("design:type", String)
], Configuration.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'description', type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], Configuration.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'value', type: 'varchar', nullable: false }),
    __metadata("design:type", String)
], Configuration.prototype, "value", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'value_type', type: 'varchar', nullable: false }),
    __metadata("design:type", String)
], Configuration.prototype, "valueType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_at', type: 'timestamp', nullable: false }),
    __metadata("design:type", Date)
], Configuration.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'updated_at', type: 'timestamp', nullable: false }),
    __metadata("design:type", Date)
], Configuration.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'updated_by', type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Configuration.prototype, "updatedBy", void 0);
exports.Configuration = Configuration = __decorate([
    (0, typeorm_1.Entity)('configurations'),
    (0, typeorm_1.Index)(['idTenant', 'code']),
    (0, typeorm_1.Index)(['idTenant'])
], Configuration);
//# sourceMappingURL=configuration.entity.js.map
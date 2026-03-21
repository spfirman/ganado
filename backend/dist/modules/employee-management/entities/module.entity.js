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
exports.ModuleEntity = void 0;
const typeorm_1 = require("typeorm");
const role_module_permission_entity_1 = require("./role-module-permission.entity");
let ModuleEntity = class ModuleEntity {
};
exports.ModuleEntity = ModuleEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ModuleEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 20, nullable: false, unique: true }),
    __metadata("design:type", String)
], ModuleEntity.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: false, unique: true }),
    __metadata("design:type", String)
], ModuleEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 250, nullable: true }),
    __metadata("design:type", String)
], ModuleEntity.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], ModuleEntity.prototype, "access_details", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => role_module_permission_entity_1.RoleModulePermission, permission => permission.module),
    __metadata("design:type", Array)
], ModuleEntity.prototype, "permissions", void 0);
exports.ModuleEntity = ModuleEntity = __decorate([
    (0, typeorm_1.Entity)('modules')
], ModuleEntity);
//# sourceMappingURL=module.entity.js.map
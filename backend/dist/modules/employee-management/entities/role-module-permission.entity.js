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
exports.RoleModulePermission = void 0;
const typeorm_1 = require("typeorm");
const role_entity_1 = require("./role.entity");
const module_entity_1 = require("./module.entity");
let RoleModulePermission = class RoleModulePermission {
    id;
    id_role;
    id_module;
    tenant_id;
    can_create;
    can_read;
    can_update;
    can_delete;
    can_list;
    role;
    module;
};
exports.RoleModulePermission = RoleModulePermission;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], RoleModulePermission.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_role' }),
    __metadata("design:type", String)
], RoleModulePermission.prototype, "id_role", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_module' }),
    __metadata("design:type", String)
], RoleModulePermission.prototype, "id_module", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tenant_id' }),
    __metadata("design:type", String)
], RoleModulePermission.prototype, "tenant_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'can_create', default: false }),
    __metadata("design:type", Boolean)
], RoleModulePermission.prototype, "can_create", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'can_read', default: false }),
    __metadata("design:type", Boolean)
], RoleModulePermission.prototype, "can_read", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'can_update', default: false }),
    __metadata("design:type", Boolean)
], RoleModulePermission.prototype, "can_update", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'can_delete', default: false }),
    __metadata("design:type", Boolean)
], RoleModulePermission.prototype, "can_delete", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'can_list', default: false }),
    __metadata("design:type", Boolean)
], RoleModulePermission.prototype, "can_list", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => role_entity_1.Role, role => role.permissions),
    (0, typeorm_1.JoinColumn)({ name: 'id_role' }),
    __metadata("design:type", role_entity_1.Role)
], RoleModulePermission.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => module_entity_1.ModuleEntity),
    (0, typeorm_1.JoinColumn)({ name: 'id_module' }),
    __metadata("design:type", module_entity_1.ModuleEntity)
], RoleModulePermission.prototype, "module", void 0);
exports.RoleModulePermission = RoleModulePermission = __decorate([
    (0, typeorm_1.Entity)('role_module_permissions')
], RoleModulePermission);
//# sourceMappingURL=role-module-permission.entity.js.map
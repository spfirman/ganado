"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeManagementModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const tenants_controller_1 = require("./controllers/tenants.controller");
const roles_controller_1 = require("./controllers/roles.controller");
const users_controller_1 = require("./controllers/users.controller");
const tenants_service_1 = require("./services/tenants.service");
const roles_service_1 = require("./services/roles.service");
const users_service_1 = require("./services/users.service");
const modules_service_1 = require("./services/modules.service");
const tenant_entity_1 = require("./entities/tenant.entity");
const role_entity_1 = require("./entities/role.entity");
const user_entity_1 = require("./entities/user.entity");
const role_module_permission_entity_1 = require("./entities/role-module-permission.entity");
const module_entity_1 = require("./entities/module.entity");
const user_repository_1 = require("./repositories/user.repository");
const role_module_permission_repository_1 = require("./repositories/role-module-permission.repository");
const role_module_permission_services_1 = require("./services/role-module-permission.services");
const application_permissions_module_1 = require("../../common/application-permissions/application-permissions.module");
const role_repository_1 = require("./repositories/role.repository");
const configuration_module_1 = require("../configurations/configuration.module");
let EmployeeManagementModule = class EmployeeManagementModule {
};
exports.EmployeeManagementModule = EmployeeManagementModule;
exports.EmployeeManagementModule = EmployeeManagementModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                tenant_entity_1.Tenant,
                role_entity_1.Role,
                user_entity_1.User,
                role_module_permission_entity_1.RoleModulePermission,
                module_entity_1.ModuleEntity
            ]),
            application_permissions_module_1.ApplicationPermissionsModule,
            configuration_module_1.ConfigurationModule
        ],
        controllers: [
            tenants_controller_1.TenantsController,
            roles_controller_1.RolesController,
            users_controller_1.UsersController,
        ],
        providers: [
            tenants_service_1.TenantsService,
            roles_service_1.RoleService,
            users_service_1.UsersService,
            modules_service_1.ModulesService,
            role_module_permission_services_1.RoleModulePermissionService,
            user_repository_1.UserRepository,
            role_module_permission_repository_1.RoleModulePermissionRepository,
            role_repository_1.RoleRepository
        ],
        exports: [
            users_service_1.UsersService,
            roles_service_1.RoleService,
            modules_service_1.ModulesService,
            tenants_service_1.TenantsService,
            role_module_permission_services_1.RoleModulePermissionService
        ]
    })
], EmployeeManagementModule);
//# sourceMappingURL=employee-management.module.js.map
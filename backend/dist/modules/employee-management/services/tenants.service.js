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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const tenant_entity_1 = require("../entities/tenant.entity");
const roles_service_1 = require("./roles.service");
const users_service_1 = require("./users.service");
const modules_service_1 = require("./modules.service");
const create_permission_dto_1 = require("../dto/create-permission.dto");
const role_module_permission_services_1 = require("./role-module-permission.services");
const typeorm_3 = require("typeorm");
const typeorm_4 = require("@nestjs/typeorm");
const configurations_service_1 = require("../../configurations/services/configurations.service");
let TenantsService = class TenantsService {
    dataSource;
    tenantRepository;
    rolesService;
    RoleModulePermissionService;
    usersService;
    modulesService;
    configurationsService;
    constructor(dataSource, tenantRepository, rolesService, RoleModulePermissionService, usersService, modulesService, configurationsService) {
        this.dataSource = dataSource;
        this.tenantRepository = tenantRepository;
        this.rolesService = rolesService;
        this.RoleModulePermissionService = RoleModulePermissionService;
        this.usersService = usersService;
        this.modulesService = modulesService;
        this.configurationsService = configurationsService;
    }
    async create(createTenantDto) {
        return this.dataSource.transaction(async (manager) => {
            console.log('createTenantDto', createTenantDto);
            const tenantRepo = manager.getRepository(tenant_entity_1.Tenant);
            const existingTenant = await tenantRepo.findOne({
                where: {
                    name: createTenantDto.name,
                    company_username: createTenantDto.company_username
                }
            });
            if (existingTenant) {
                throw new common_1.ConflictException('Ya existe un tenant con ese nombre o username de compañía');
            }
            const tenant = tenantRepo.create(createTenantDto);
            await tenantRepo.save(tenant);
            const adminUser = await this.usersService.createAdminUser({
                username: createTenantDto.admin_username,
                password: createTenantDto.admin_password,
                email: createTenantDto.admin_email,
                firstName: createTenantDto.admin_first_name,
                lastName: createTenantDto.admin_last_name,
                tenantId: tenant.id
            }, manager);
            const allModules = await this.modulesService.findAll(manager);
            const roles = await this.rolesService.findAll(tenant.id, manager);
            const permissionsToCreate = [];
            for (const role of roles) {
                for (const module of allModules) {
                    switch (role.code) {
                        case 'SYS_ADMIN':
                            const sysAdminPermission = new create_permission_dto_1.CreatePermissionDto();
                            sysAdminPermission.moduleId = module.id;
                            sysAdminPermission.roleId = role.id;
                            sysAdminPermission.can_create = true;
                            sysAdminPermission.can_read = true;
                            sysAdminPermission.can_update = true;
                            sysAdminPermission.can_delete = true;
                            sysAdminPermission.can_list = true;
                            permissionsToCreate.push(sysAdminPermission);
                            break;
                        case 'MANAGER':
                            if (module.code == 'EMP_MGMT' || module.code == 'COMMERCE') {
                                const managerPermission = new create_permission_dto_1.CreatePermissionDto();
                                managerPermission.moduleId = module.id;
                                managerPermission.roleId = role.id;
                                managerPermission.can_create = true;
                                managerPermission.can_read = true;
                                managerPermission.can_update = true;
                                managerPermission.can_delete = true;
                                managerPermission.can_list = true;
                                permissionsToCreate.push(managerPermission);
                            }
                            break;
                        case 'ACCOUNTANT':
                            if (module.code == 'COMMERCE') {
                                const accountantPermission = new create_permission_dto_1.CreatePermissionDto();
                                accountantPermission.moduleId = module.id;
                                accountantPermission.roleId = role.id;
                                accountantPermission.can_create = true;
                                accountantPermission.can_read = true;
                                accountantPermission.can_update = true;
                                accountantPermission.can_delete = true;
                                accountantPermission.can_list = true;
                                permissionsToCreate.push(accountantPermission);
                            }
                            break;
                        case 'FARM_WORKER':
                            if (module.code == 'MASSIVE_EVENTS' || module.code == 'FARM' || module.code == 'RECEPTION' || module.code == 'PROD_CENTER') {
                                const workerPermission = new create_permission_dto_1.CreatePermissionDto();
                                workerPermission.moduleId = module.id;
                                workerPermission.roleId = role.id;
                                workerPermission.can_create = true;
                                workerPermission.can_read = true;
                                workerPermission.can_update = true;
                                workerPermission.can_delete = true;
                                workerPermission.can_list = true;
                                permissionsToCreate.push(workerPermission);
                            }
                            if (module.code == 'COMMERCE') {
                                const workerCommercePermission = new create_permission_dto_1.CreatePermissionDto();
                                workerCommercePermission.moduleId = module.id;
                                workerCommercePermission.roleId = role.id;
                                workerCommercePermission.can_create = false;
                                workerCommercePermission.can_read = true;
                                workerCommercePermission.can_update = false;
                                workerCommercePermission.can_delete = false;
                                workerCommercePermission.can_list = true;
                                permissionsToCreate.push(workerCommercePermission);
                            }
                            break;
                        default:
                            break;
                    }
                }
            }
            if (permissionsToCreate.length > 0) {
                await this.RoleModulePermissionService.createPermissions(tenant.id, permissionsToCreate, manager);
            }
            await this.configurationsService.createTenantDefaults(tenant.id, manager);
            return tenant;
        });
    }
    async findAll() {
        return this.tenantRepository.find();
    }
    async findOne(id) {
        const tenant = await this.tenantRepository.findOne({ where: { id } });
        if (!tenant) {
            throw new common_1.NotFoundException(`Tenant with ID ${id} not found`);
        }
        return tenant;
    }
    async update(id, updateTenantDto) {
        const tenant = await this.findOne(id);
        this.tenantRepository.merge(tenant, updateTenantDto);
        return this.tenantRepository.save(tenant);
    }
    async findByCompanyUsername(company_username) {
        const tenant = await this.tenantRepository.findOne({
            where: { company_username }
        });
        if (!tenant) {
            throw new common_1.NotFoundException(`Tenant with company_username ${company_username} not found`);
        }
        return tenant;
    }
};
exports.TenantsService = TenantsService;
exports.TenantsService = TenantsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_4.InjectDataSource)()),
    __param(1, (0, typeorm_1.InjectRepository)(tenant_entity_1.Tenant)),
    __metadata("design:paramtypes", [typeorm_3.DataSource,
        typeorm_2.Repository,
        roles_service_1.RoleService,
        role_module_permission_services_1.RoleModulePermissionService,
        users_service_1.UsersService,
        modules_service_1.ModulesService,
        configurations_service_1.ConfigurationsService])
], TenantsService);
//# sourceMappingURL=tenants.service.js.map
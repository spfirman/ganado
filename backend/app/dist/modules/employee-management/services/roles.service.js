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
var RoleService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const role_entity_1 = require("../entities/role.entity");
const role_module_permission_entity_1 = require("../entities/role-module-permission.entity");
const module_entity_1 = require("../entities/module.entity");
const user_entity_1 = require("../entities/user.entity");
const role_repository_1 = require("../repositories/role.repository");
const role_read_dto_1 = require("../dto/role-read.dto");
const role_module_permission_services_1 = require("./role-module-permission.services");
let RoleService = RoleService_1 = class RoleService {
    roleRepository_2;
    roleRepository;
    permissionRepository;
    roleModulePermissionService;
    moduleRepository;
    userRepository;
    logger = new common_1.Logger(RoleService_1.name);
    constructor(roleRepository_2, roleRepository, permissionRepository, roleModulePermissionService, moduleRepository, userRepository) {
        this.roleRepository_2 = roleRepository_2;
        this.roleRepository = roleRepository;
        this.permissionRepository = permissionRepository;
        this.roleModulePermissionService = roleModulePermissionService;
        this.moduleRepository = moduleRepository;
        this.userRepository = userRepository;
    }
    async findAll(idTenant, manager) {
        const roles = await this.roleRepository.findAllByTenantID(idTenant, manager);
        if (roles.length > 0) {
            const rolesDto = roles.map(role => role_read_dto_1.RoleReadDto.transformToDto(role));
            return rolesDto;
        }
        else {
            throw new common_1.NotFoundException('No roles found for tenant');
        }
    }
    async findOne(id) {
        const role = await this.roleRepository.findById(id);
        if (!role) {
            throw new common_1.NotFoundException(`Role with ID ${id} not found`);
        }
        return role_read_dto_1.RoleReadDto.transformToDto(role);
    }
    async findByCode(code, manager) {
        const roleRepo = manager?.getRepository(role_entity_1.Role) || this.roleRepository;
        const role = await roleRepo.findOne({ where: { code } });
        if (!role) {
            throw new common_1.NotFoundException(`Role with code '${code}' not found`);
        }
        return role;
    }
};
exports.RoleService = RoleService;
exports.RoleService = RoleService = RoleService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(role_entity_1.Role)),
    __param(2, (0, typeorm_1.InjectRepository)(role_module_permission_entity_1.RoleModulePermission)),
    __param(4, (0, typeorm_1.InjectRepository)(module_entity_1.ModuleEntity)),
    __param(5, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        role_repository_1.RoleRepository,
        typeorm_2.Repository,
        role_module_permission_services_1.RoleModulePermissionService,
        typeorm_2.Repository,
        typeorm_2.Repository])
], RoleService);
//# sourceMappingURL=roles.service.js.map
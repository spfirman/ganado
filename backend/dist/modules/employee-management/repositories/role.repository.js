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
var RoleRepository_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleRepository = void 0;
const typeorm_1 = require("typeorm");
const Repository_1 = require("typeorm/repository/Repository");
const role_entity_1 = require("../entities/role.entity");
const common_1 = require("@nestjs/common");
let RoleRepository = RoleRepository_1 = class RoleRepository extends Repository_1.Repository {
    constructor(dataSource) {
        super(role_entity_1.Role, dataSource.createEntityManager());
        this.dataSource = dataSource;
        this.logger = new common_1.Logger(RoleRepository_1.name);
    }
    async findAllByTenantID(tenantId, manager) {
        const repo = manager?.getRepository(role_entity_1.Role) ?? this.dataSource.getRepository(role_entity_1.Role);
        try {
            const query = repo
                .createQueryBuilder('role')
                .leftJoinAndSelect('role.permissions', 'permissions', 'permissions.tenant_id = :tenantId', { tenantId })
                .leftJoinAndSelect('permissions.module', 'module')
                .where('(permissions.tenant_id = :tenantId OR permissions.id IS NULL)', { tenantId: tenantId });
            const roles = await query.getMany();
            this.logger.debug('Roles encontrados:', roles.length);
            return roles;
        }
        catch (error) {
            this.logger.error('Error searching roles by tenantId:', error);
            throw new common_1.InternalServerErrorException('Error searching roles');
        }
    }
    async findById(id) {
        try {
            return await this.findOne({
                where: { id },
                relations: ['permissions', 'permissions.module'],
            });
        }
        catch (error) {
            this.logger.error(`Error searching role by ID ${id}:`, error);
            throw new common_1.InternalServerErrorException('Error searching role');
        }
    }
    async findByCode(code) {
        try {
            return await this.findOne({
                where: { code },
                relations: ['permissions', 'permissions.module'],
            });
        }
        catch (error) {
            this.logger.error(`Error searching role by code ${code}:`, error);
            throw new common_1.InternalServerErrorException('Error searching role');
        }
    }
};
exports.RoleRepository = RoleRepository;
exports.RoleRepository = RoleRepository = RoleRepository_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], RoleRepository);
//# sourceMappingURL=role.repository.js.map
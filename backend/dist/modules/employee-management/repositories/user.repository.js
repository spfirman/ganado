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
var UserRepository_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const typeorm_1 = require("typeorm");
const Repository_1 = require("typeorm/repository/Repository");
const user_entity_1 = require("../entities/user.entity");
const common_1 = require("@nestjs/common");
const role_entity_1 = require("../entities/role.entity");
let UserRepository = UserRepository_1 = class UserRepository extends Repository_1.Repository {
    constructor(dataSource) {
        super(user_entity_1.User, dataSource.createEntityManager());
        this.dataSource = dataSource;
        this.logger = new common_1.Logger(UserRepository_1.name);
    }
    async findById(id) {
        const user = await this.findOne({
            where: { id },
            relations: ['roles'],
        });
        return user;
    }
    async findByIdAndTenantId(id, tenantId) {
        try {
            const user = await this.findOne({ where: { id, tenantId } });
            return user;
        }
        catch (error) {
            this.logger.error('Error en la consulta:', error);
            throw new common_1.InternalServerErrorException('Error al buscar el usuario por ID y tenantId');
        }
    }
    async findByTenant(tenantId) {
        try {
            const users = await this.find({ where: { tenantId } });
            return users;
        }
        catch (error) {
            this.logger.error('Error en la consulta:', error);
            throw new common_1.InternalServerErrorException('Error al buscar usuarios por tenantId');
        }
    }
    async findByUsernameAndTenant(username, tenantId) {
        const user = await this.findOne({
            where: { username, tenantId: tenantId },
            relations: ['roles'],
        });
        return user;
    }
    async findByUsernameAndCompanyUsername(username, company_username) {
        try {
            const queryBuilder = await this.createQueryBuilder('user')
                .innerJoinAndSelect('user.tenant', 'tenant')
                .leftJoinAndSelect('user.roles', 'roles', 'roles.id IN (SELECT id_role FROM user_roles WHERE id_user = user.id)')
                .where('user.username = :username', { username })
                .andWhere('tenant.company_username = :company_username', {
                company_username,
            })
                .andWhere('user.active = true');
            const sql = queryBuilder.getSql();
            const parameters = queryBuilder.getParameters();
            const user = await queryBuilder.getOne();
            return user || null;
        }
        catch (error) {
            this.logger.error('Error en la consulta:', error);
            if (error.code === '42P01') {
                throw new common_1.InternalServerErrorException('La tabla no existe');
            }
            else if (error.code === '42703') {
                throw new common_1.InternalServerErrorException('Una columna referenciada no existe', { cause: error.message });
            }
            else {
                throw new common_1.InternalServerErrorException('Database error', {
                    cause: error.message,
                });
            }
        }
    }
    async createUserWithRoles(createUserDto, hashedPassword, manager) {
        let queryRunner;
        if (!manager) {
            queryRunner = this.dataSource.createQueryRunner();
            await queryRunner.connect();
            await queryRunner.startTransaction();
            manager = queryRunner.manager;
        }
        try {
            const roleIds = Array.isArray(createUserDto.roleIds)
                ? createUserDto.roleIds
                : [];
            if (roleIds.length > 0) {
                const existingRoles = await manager.find(role_entity_1.Role, {
                    where: { id: (0, typeorm_1.In)(roleIds) },
                });
                if (existingRoles.length !== roleIds.length) {
                    throw new common_1.BadRequestException('Some roles do not exist');
                }
            }
            const userData = {
                ...createUserDto,
                password: hashedPassword,
            };
            const user = manager.create(user_entity_1.User, userData);
            await manager.save(user);
            if (roleIds.length > 0) {
                const values = roleIds.map((roleId) => ({
                    id_user: user.id,
                    id_role: roleId,
                }));
                await manager
                    .createQueryBuilder()
                    .insert()
                    .into('user_roles')
                    .values(values)
                    .execute();
            }
            if (queryRunner) {
                await queryRunner.commitTransaction();
            }
            return user;
        }
        catch (error) {
            this.logger.error('Error creating user with roles', error);
            if (queryRunner) {
                await queryRunner.rollbackTransaction();
            }
            throw error;
        }
        finally {
            if (queryRunner) {
                await queryRunner.release();
            }
        }
    }
    async UpdateUserWithRoles(user, updateUserDto, hashedPassword, manager) {
        let queryRunner;
        if (!manager) {
            queryRunner = this.dataSource.createQueryRunner();
            await queryRunner.connect();
            await queryRunner.startTransaction();
            manager = queryRunner.manager;
        }
        try {
            const userData = {};
            if (updateUserDto.username)
                userData.username = updateUserDto.username;
            if (updateUserDto.firstName)
                userData.firstName = updateUserDto.firstName;
            if (updateUserDto.lastName)
                userData.lastName = updateUserDto.lastName;
            if (updateUserDto.email)
                userData.email = updateUserDto.email;
            if (hashedPassword)
                userData.password = hashedPassword;
            if (updateUserDto.hasOwnProperty('active')) {
                userData.active = updateUserDto.active;
            }
            await manager.update(user_entity_1.User, user.id, userData);
            if (updateUserDto.roleIds && updateUserDto.roleIds.length > 0) {
                const existingRoles = await manager.find(role_entity_1.Role, {
                    where: { id: (0, typeorm_1.In)(updateUserDto.roleIds) },
                });
                if (existingRoles.length !== updateUserDto.roleIds.length) {
                    throw new common_1.BadRequestException('Algunos roles no existen');
                }
                await manager
                    .createQueryBuilder()
                    .delete()
                    .from('user_roles')
                    .where('id_user = :userId', { userId: user.id })
                    .execute();
                const values = updateUserDto.roleIds.map((roleId) => ({
                    id_user: user.id,
                    id_role: roleId,
                }));
                if (values.length > 0) {
                    await manager
                        .createQueryBuilder()
                        .insert()
                        .into('user_roles')
                        .values(values)
                        .execute();
                }
            }
            const updatedUser = await manager.findOne(user_entity_1.User, {
                where: { id: user.id },
                relations: ['roles'],
            });
            if (!updatedUser) {
                throw new common_1.BadRequestException('Error al actualizar el usuario');
            }
            if (queryRunner) {
                await queryRunner.commitTransaction();
            }
            return updatedUser;
        }
        catch (error) {
            this.logger.error('Error actualizando usuario con roles', error);
            if (queryRunner) {
                await queryRunner.rollbackTransaction();
            }
            throw error;
        }
        finally {
            if (queryRunner) {
                await queryRunner.release();
            }
        }
    }
    async deleteUserWithRoles(id, manager) {
        let queryRunner;
        if (!manager) {
            queryRunner = this.dataSource.createQueryRunner();
            await queryRunner.connect();
            await queryRunner.startTransaction();
            manager = queryRunner.manager;
        }
        try {
            const user = await manager.findOne(user_entity_1.User, {
                where: { id },
            });
            if (!user) {
                return false;
            }
            await manager
                .createQueryBuilder()
                .delete()
                .from('user_roles')
                .where('id_user = :userId', { userId: id })
                .execute();
            await manager.delete(user_entity_1.User, id);
            if (queryRunner) {
                await queryRunner.commitTransaction();
            }
            return true;
        }
        catch (error) {
            this.logger.error('Error eliminando usuario con roles', error);
            if (queryRunner) {
                await queryRunner.rollbackTransaction();
            }
            throw error;
        }
        finally {
            if (queryRunner) {
                await queryRunner.release();
            }
        }
    }
};
exports.UserRepository = UserRepository;
exports.UserRepository = UserRepository = UserRepository_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], UserRepository);
//# sourceMappingURL=user.repository.js.map
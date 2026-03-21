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
var UsersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const class_transformer_1 = require("class-transformer");
const bcrypt = require("bcrypt");
const user_entity_1 = require("../entities/user.entity");
const role_entity_1 = require("../entities/role.entity");
const roles_service_1 = require("./roles.service");
const user_response_dto_1 = require("../dto/user-response.dto");
const user_repository_1 = require("../repositories/user.repository");
const application_permissions_service_1 = require("../../../common/application-permissions/application-permissions.service");
let UsersService = UsersService_1 = class UsersService {
    constructor(userRepository, userCustomRepository, rolesRepository, rolesService, applicationPermissionsService) {
        this.userRepository = userRepository;
        this.userCustomRepository = userCustomRepository;
        this.rolesRepository = rolesRepository;
        this.rolesService = rolesService;
        this.applicationPermissionsService = applicationPermissionsService;
        this.logger = new common_1.Logger(UsersService_1.name);
    }
    async create(createUserDto) {
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        const savedUser = await this.userCustomRepository.createUserWithRoles(createUserDto, hashedPassword);
        return (0, class_transformer_1.plainToInstance)(user_response_dto_1.UserResponseDto, savedUser);
    }
    async findOne(id, sessionUser) {
        const user = await this.userRepository.findOne({
            where: {
                id,
                tenantId: sessionUser.tenant_id,
            },
            relations: ['roles'],
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        return (0, class_transformer_1.plainToInstance)(user_response_dto_1.UserResponseDto, user);
    }
    async update(id, updateUserDto, sessionUser) {
        const user = await this.userCustomRepository.findById(id);
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        const isOwnUser = sessionUser.sub === id;
        if (!isOwnUser && sessionUser.tenant_id !== user.tenantId) {
            throw new common_1.ForbiddenException('No tienes permisos para modificar este usuario');
        }
        if (updateUserDto.username && updateUserDto.username !== user.username) {
            const existingUser = await this.userCustomRepository.findByUsernameAndTenant(updateUserDto.username, sessionUser.tenant_id);
            if (existingUser) {
                throw new common_1.ConflictException('El nombre de usuario ya esta en uso');
            }
        }
        if (updateUserDto.tenantId) {
            throw new common_1.ForbiddenException('No se permite modificar el tenant de un usuario');
        }
        let hashedPassword;
        if (updateUserDto.password) {
            hashedPassword = await this.getHashedPassword(updateUserDto.password);
            delete updateUserDto.password;
        }
        const updatedUser = await this.userCustomRepository.UpdateUserWithRoles(user, updateUserDto, hashedPassword);
        return (0, class_transformer_1.plainToInstance)(user_response_dto_1.UserResponseDto, updatedUser);
    }
    async remove(id, sessionUser) {
        const user = await this.userCustomRepository.findById(id);
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        const isOwnUser = sessionUser.sub === id;
        if (!isOwnUser) {
            if (sessionUser.tenant_id !== user.tenantId) {
                throw new common_1.ForbiddenException('No tienes permisos para eliminar este usuario');
            }
        }
        const deleted = await this.userCustomRepository.deleteUserWithRoles(id);
        if (!deleted) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
    }
    async findByTenant(tenantId) {
        const users = await this.userRepository.find({
            where: { tenantId: tenantId },
            relations: ['roles'],
        });
        return users;
    }
    async findAll(tenantId) {
        return this.userCustomRepository.find({
            where: { tenantId: tenantId },
            relations: ['roles', 'roles.permissions', 'roles.permissions.module'],
        });
    }
    async findWithPagination(tenantId, page = 1, limit = 10, filters = {}) {
        const { username, lastName } = filters;
        const query = this.userRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.roles', 'roles')
            .where('user.tenantId = :tenantId', { tenantId });
        if (username) {
            query.andWhere('LOWER(user.username) LIKE :username', {
                username: `%${username.toLowerCase()}%`,
            });
        }
        if (lastName) {
            query.andWhere('LOWER(user.lastName) LIKE :lastName', {
                lastName: `%${lastName.toLowerCase()}%`,
            });
        }
        query
            .skip((page - 1) * limit)
            .take(limit)
            .orderBy('user.username', 'ASC');
        const [users, total] = await query.getManyAndCount();
        return {
            items: users.map((user) => (0, class_transformer_1.plainToInstance)(user_response_dto_1.UserResponseDto, user)),
            total,
        };
    }
    async findByUsernameAndPasswordAndCompanyUsername(username, password, company_username) {
        try {
            const user_db = await this.userCustomRepository.findByUsernameAndCompanyUsername(username, company_username);
            if (!user_db) {
                throw new common_1.UnauthorizedException('Credenciales invalidas');
                return null;
            }
            var user = null;
            const isPasswordValid = await bcrypt.compare(password, user_db.password);
            if (!isPasswordValid) {
                throw new common_1.UnauthorizedException('Credenciales invalidas');
            }
            user = (0, class_transformer_1.plainToInstance)(user_entity_1.User, user_db);
            return user;
        }
        catch (error) {
            this.logger.error('Error en findByUsernameAndPasswordAndCompanyUsername:', error);
            throw error;
        }
    }
    getHashedPassword(password) {
        return bcrypt.hash(password, 10);
    }
    async findByUsername(username, tenantId) {
        const user = await this.userRepository.findOne({
            where: { username, tenantId: tenantId },
            relations: ['roles', 'tenant'],
        });
        return user || undefined;
    }
    async validateUser(username, password, tenantId) {
        const user = await this.findByUsername(username, tenantId);
        if (user && (await bcrypt.compare(password, user.password))) {
            return (0, class_transformer_1.plainToInstance)(user_response_dto_1.UserResponseDto, user);
        }
        return undefined;
    }
    async createAdminUser(dto, manager) {
        const userRepository = manager
            ? manager.getRepository(user_entity_1.User)
            : this.userRepository;
        const where = [
            { username: dto.username, tenantId: dto.tenantId },
            { email: dto.email, tenantId: dto.tenantId },
        ];
        const existingUser = await userRepository.findOne({ where });
        if (existingUser) {
            throw new common_1.ConflictException('Ya existe un usuario con ese username o email en este tenant');
        }
        const adminRole = await this.rolesService.findByCode('SYS_ADMIN');
        if (!adminRole) {
            throw new common_1.NotFoundException('Admin role not found');
        }
        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const user = userRepository.create({
            username: dto.username,
            password: hashedPassword,
            email: dto.email,
            firstName: dto.firstName,
            lastName: dto.lastName,
            tenantId: dto.tenantId,
            roles: [adminRole],
        });
        const savedUser = await userRepository.save(user);
        return (0, class_transformer_1.plainToInstance)(user_response_dto_1.UserResponseDto, savedUser);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = UsersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(role_entity_1.Role)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        user_repository_1.UserRepository,
        typeorm_2.Repository,
        roles_service_1.RoleService,
        application_permissions_service_1.ApplicationPermissionsService])
], UsersService);
//# sourceMappingURL=users.service.js.map
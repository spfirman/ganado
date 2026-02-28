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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const users_service_1 = require("../services/users.service");
const create_user_dto_1 = require("../dto/create-user.dto");
const update_user_dto_1 = require("../dto/update-user.dto");
const user_entity_1 = require("../entities/user.entity");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const application_permissions_decorator_1 = require("../../../common/application-permissions/application-permissions.decorator");
const user_response_dto_1 = require("../dto/user-response.dto");
const application_permissions_guard_1 = require("../../../common/application-permissions/application-permissions.guard");
const session_user_decorator_1 = require("../../../common/decorators/session-user.decorator");
const session_user_dto_1 = require("../../auth/dto/session-user.dto");
const roles_service_1 = require("../services/roles.service");
let UsersController = class UsersController {
    usersService;
    rolesService;
    constructor(usersService, rolesService) {
        this.usersService = usersService;
        this.rolesService = rolesService;
    }
    async create(sessionUser, createUserDto) {
        createUserDto.tenantId = sessionUser.tenant_id;
        return this.usersService.create(createUserDto);
    }
    async getRoles(sessionUser) {
        return this.rolesService.findAll(sessionUser.tenant_id);
    }
    async findOne(sessionUser, id) {
        return this.usersService.findOne(id, sessionUser);
    }
    async update(sessionUser, id, updateUserDto) {
        return this.usersService.update(id, updateUserDto, sessionUser);
    }
    async delete(sessionUser, id) {
        return this.usersService.remove(id, sessionUser);
    }
    async list(sessionUser, page, limit, username, lastName) {
        return this.usersService.findWithPagination(sessionUser.tenant_id, page, limit, { username, lastName });
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Post)(),
    (0, application_permissions_decorator_1.RequireAction)('create'),
    (0, swagger_1.ApiOperation)({ summary: 'Crear un nuevo usuario' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Usuario creado exitosamente',
        type: user_entity_1.User
    }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'No tienes permisos para crear usuarios' }),
    __param(0, (0, session_user_decorator_1.SessionUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_dto_1.SessionUserDto, create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('roles'),
    (0, application_permissions_decorator_1.RequireAction)('read'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener roles disponibles' }),
    __param(0, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_dto_1.SessionUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getRoles", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, application_permissions_decorator_1.RequireAction)('read'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener un usuario por ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Usuario encontrado exitosamente',
        type: user_entity_1.User
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Usuario no encontrado' }),
    __param(0, (0, session_user_decorator_1.SessionUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_dto_1.SessionUserDto, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, application_permissions_decorator_1.RequireAction)('update'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar un usuario' }),
    (0, swagger_1.ApiBody)({
        type: update_user_dto_1.UpdateUserDto,
        description: 'Actualizar datos usuario.',
        required: true
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Usuario actualizado exitosamente',
        type: user_entity_1.User
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Usuario no encontrado' }),
    __param(0, (0, session_user_decorator_1.SessionUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_dto_1.SessionUserDto, String, update_user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, application_permissions_decorator_1.RequireAction)('delete'),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar un usuario' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Usuario eliminado exitosamente'
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Usuario no encontrado' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'No tienes permisos para eliminar usuarios' }),
    __param(0, (0, session_user_decorator_1.SessionUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_dto_1.SessionUserDto, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "delete", null);
__decorate([
    (0, common_1.Get)(),
    (0, application_permissions_decorator_1.RequireAction)('list'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todos los usuarios' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Lista de usuarios obtenida exitosamente',
        type: [user_response_dto_1.UserResponseDto]
    }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'No tienes permisos para ver usuarios' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'No tienes permisos para ver usuarios' }),
    __param(0, (0, session_user_decorator_1.SessionUser)()),
    __param(1, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(10), common_1.ParseIntPipe)),
    __param(3, (0, common_1.Query)('username')),
    __param(4, (0, common_1.Query)('lastName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_dto_1.SessionUserDto, Number, Number, String, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "list", null);
exports.UsersController = UsersController = __decorate([
    (0, swagger_1.ApiTags)('Users'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.Controller)('users'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, application_permissions_guard_1.ApplicationPermissionsGuard),
    (0, application_permissions_decorator_1.RequireModule)('EMP_MGMT'),
    (0, application_permissions_decorator_1.RequireEntity)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        roles_service_1.RoleService])
], UsersController);
//# sourceMappingURL=users.controller.js.map
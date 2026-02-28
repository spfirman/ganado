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
exports.DeviceProfilesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const device_profiles_service_1 = require("../services/device-profiles.service");
const create_device_profile_dto_1 = require("../dto/create-device-profile.dto");
const update_device_profile_dto_1 = require("../dto/update-device-profile.dto");
const device_profile_response_dto_1 = require("../dto/device-profile-response.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const swagger_2 = require("@nestjs/swagger");
const application_permissions_guard_1 = require("../../../common/application-permissions/application-permissions.guard");
const application_permissions_decorator_1 = require("../../../common/application-permissions/application-permissions.decorator");
const session_user_decorator_1 = require("../../../common/decorators/session-user.decorator");
const session_user_dto_1 = require("../../auth/dto/session-user.dto");
let DeviceProfilesController = class DeviceProfilesController {
    deviceProfilesService;
    constructor(deviceProfilesService) {
        this.deviceProfilesService = deviceProfilesService;
    }
    async create(sessionUser, createDeviceProfileDto) {
        createDeviceProfileDto.idTenant = sessionUser.tenant_id;
        createDeviceProfileDto.createdAt = new Date();
        createDeviceProfileDto.updatedAt = new Date();
        return await this.deviceProfilesService.create(createDeviceProfileDto);
    }
    async findAll(sessionUser) {
        return await this.deviceProfilesService.findAll(sessionUser.tenant_id);
    }
    async findOne(id, sessionUser) {
        return await this.deviceProfilesService.findOne(id, sessionUser.tenant_id);
    }
    async update(id, sessionUser, updateDeviceProfileDto) {
        updateDeviceProfileDto.updatedAt = new Date();
        return await this.deviceProfilesService.update(id, sessionUser.tenant_id, updateDeviceProfileDto);
    }
    async remove(id, sessionUser) {
        return await this.deviceProfilesService.remove(id, sessionUser.tenant_id);
    }
};
exports.DeviceProfilesController = DeviceProfilesController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Crear un nuevo perfil de dispositivo' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Perfil de dispositivo creado exitosamente', type: device_profile_response_dto_1.DeviceProfileResponseDto }),
    (0, application_permissions_decorator_1.RequireAction)('create'),
    __param(0, (0, session_user_decorator_1.SessionUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_dto_1.SessionUserDto, create_device_profile_dto_1.CreateDeviceProfileDto]),
    __metadata("design:returntype", Promise)
], DeviceProfilesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todos los perfiles de dispositivo' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de perfiles de dispositivo', type: [device_profile_response_dto_1.DeviceProfileResponseDto] }),
    (0, application_permissions_decorator_1.RequireAction)('list'),
    __param(0, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_dto_1.SessionUserDto]),
    __metadata("design:returntype", Promise)
], DeviceProfilesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener un perfil de dispositivo por ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Perfil de dispositivo encontrado', type: device_profile_response_dto_1.DeviceProfileResponseDto }),
    (0, application_permissions_decorator_1.RequireAction)('read'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, session_user_dto_1.SessionUserDto]),
    __metadata("design:returntype", Promise)
], DeviceProfilesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar un perfil de dispositivo' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Perfil de dispositivo actualizado', type: device_profile_response_dto_1.DeviceProfileResponseDto }),
    (0, application_permissions_decorator_1.RequireAction)('update'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, session_user_decorator_1.SessionUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, session_user_dto_1.SessionUserDto,
        update_device_profile_dto_1.UpdateDeviceProfileDto]),
    __metadata("design:returntype", Promise)
], DeviceProfilesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar un perfil de dispositivo' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Perfil de dispositivo eliminado' }),
    (0, application_permissions_decorator_1.RequireAction)('delete'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, session_user_dto_1.SessionUserDto]),
    __metadata("design:returntype", Promise)
], DeviceProfilesController.prototype, "remove", null);
exports.DeviceProfilesController = DeviceProfilesController = __decorate([
    (0, swagger_1.ApiTags)('Device Profiles'),
    (0, swagger_2.ApiBearerAuth)('access-token'),
    (0, common_1.Controller)('device-profiles'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, application_permissions_guard_1.ApplicationPermissionsGuard),
    (0, application_permissions_decorator_1.RequireModule)('PROD_CENTER'),
    (0, application_permissions_decorator_1.RequireEntity)('device_profiles'),
    __metadata("design:paramtypes", [device_profiles_service_1.DeviceProfilesService])
], DeviceProfilesController);
//# sourceMappingURL=device-profiles.controller.js.map
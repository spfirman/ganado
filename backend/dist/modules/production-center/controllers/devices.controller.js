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
exports.DevicesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const devices_service_1 = require("../services/devices.service");
const create_device_dto_1 = require("../dto/create-device.dto");
const update_device_dto_1 = require("../dto/update-device.dto");
const device_response_dto_1 = require("../dto/device-response.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const application_permissions_guard_1 = require("../../../common/application-permissions/application-permissions.guard");
const application_permissions_decorator_1 = require("../../../common/application-permissions/application-permissions.decorator");
const session_user_decorator_1 = require("../../../common/decorators/session-user.decorator");
const session_user_dto_1 = require("../../auth/dto/session-user.dto");
let DevicesController = class DevicesController {
    constructor(deviceService) {
        this.deviceService = deviceService;
    }
    async create(sessionUser, createDeviceDto) {
        createDeviceDto.idTenant = sessionUser.tenant_id;
        createDeviceDto.createdAt = new Date();
        createDeviceDto.updatedAt = new Date();
        return await this.deviceService.create(createDeviceDto);
    }
    async findOne(deveui, sessionUser) {
        return await this.deviceService.findOne(deveui, sessionUser.tenant_id);
    }
    async update(deveui, sessionUser, updateDeviceDto) {
        updateDeviceDto.updatedAt = new Date();
        return await this.deviceService.update(deveui, sessionUser.tenant_id, updateDeviceDto);
    }
    async remove(id, sessionUser) {
        return await this.deviceService.remove(id, sessionUser.tenant_id);
    }
    async list(sessionUser) {
        return await this.deviceService.findAll(sessionUser.tenant_id);
    }
    async importarExcel(file, body, sessionUser) {
        const result = await this.deviceService.importDevicesFromExcel(file, sessionUser.tenant_id, body.deviceProfileId);
        return result;
    }
};
exports.DevicesController = DevicesController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Crear un nuevo dispositivo' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Dispositivo creado exitosamente', type: device_response_dto_1.DeviceResponseDto }),
    (0, application_permissions_decorator_1.RequireAction)('create'),
    __param(0, (0, session_user_decorator_1.SessionUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_dto_1.SessionUserDto,
        create_device_dto_1.CreateDeviceDto]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':deveui'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener un dispositivo por ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Dispositivo encontrado', type: device_response_dto_1.DeviceResponseDto }),
    (0, application_permissions_decorator_1.RequireAction)('read'),
    __param(0, (0, common_1.Param)('deveui')),
    __param(1, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, session_user_dto_1.SessionUserDto]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':deveui'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar un dispositivo' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Dispositivo actualizado', type: device_response_dto_1.DeviceResponseDto }),
    (0, application_permissions_decorator_1.RequireAction)('update'),
    __param(0, (0, common_1.Param)('deveui')),
    __param(1, (0, session_user_decorator_1.SessionUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, session_user_dto_1.SessionUserDto,
        update_device_dto_1.UpdateDeviceDto]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar un dispositivo' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Dispositivo eliminado' }),
    (0, application_permissions_decorator_1.RequireAction)('delete'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, session_user_dto_1.SessionUserDto]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todos los dispositivos' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de dispositivos', type: [device_response_dto_1.DeviceResponseDto] }),
    (0, application_permissions_decorator_1.RequireAction)('list'),
    __param(0, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_dto_1.SessionUserDto]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "list", null);
__decorate([
    (0, common_1.Post)('import'),
    (0, application_permissions_decorator_1.RequireAction)('create'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads',
            filename: (req, file, cb) => {
                const randomName = Date.now() + '-' + Math.round(Math.random() * 1e9);
                cb(null, `${randomName}${(0, path_1.extname)(file.originalname)}`);
            },
        }),
        fileFilter: (req, file, cb) => {
            if (!file.originalname.match(/\.(xlsx)$/)) {
                return cb(new Error('Solo archivos .xlsx permitidos'), false);
            }
            cb(null, true);
        },
    })),
    (0, swagger_1.ApiOperation)({ summary: 'Importar archivo Excel (.xlsx)' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        description: 'Archivo Excel + datos',
        schema: {
            type: 'object',
            required: ['file'],
            properties: {
                deviceProfileId: {
                    type: 'string',
                    example: '12345e8d-926c-800c-bff5-490e7f8c6051',
                },
                file: {
                    description: 'Archivo Excel, tiene este orden de columnas: devEui, deviceName, deviceProfileId, description, joinEui, nwkKey, tags, variables. Los valores mandatorios son: devEui y deviceName. Si no se envia deviceProfileId en el excel, se debe enviar en el body de la peticion. Si no se envia joinEui, nwkKey se tomaran del deviceProfile.',
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Archivo procesado correctamente' }),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, session_user_dto_1.SessionUserDto]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "importarExcel", null);
exports.DevicesController = DevicesController = __decorate([
    (0, swagger_1.ApiTags)('Devices'),
    (0, common_1.Controller)('devices'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, application_permissions_decorator_1.RequireEntity)('devices'),
    (0, application_permissions_decorator_1.RequireModule)('PROD_CENTER'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, application_permissions_guard_1.ApplicationPermissionsGuard),
    __metadata("design:paramtypes", [devices_service_1.DevicesService])
], DevicesController);
//# sourceMappingURL=devices.controller.js.map
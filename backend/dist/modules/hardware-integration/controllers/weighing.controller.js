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
exports.WeighingController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const weighing_service_1 = require("../services/weighing.service");
const create_weighing_dto_1 = require("../dto/create-weighing.dto");
const bridge_device_dto_1 = require("../dto/bridge-device.dto");
const weighing_source_enum_1 = require("../enums/weighing-source.enum");
let WeighingController = class WeighingController {
    constructor(weighingService) {
        this.weighingService = weighingService;
    }
    async createWeighing(req, dto) {
        return this.weighingService.createWeighing(req.user.tenant_id, dto, req.user.sub);
    }
    async listWeighings(req, query) {
        return this.weighingService.listWeighings(req.user.tenant_id, query);
    }
    async getWeighing(req, id) {
        return this.weighingService.getWeighing(req.user.tenant_id, id);
    }
    async updateWeighing(req, id, dto) {
        return this.weighingService.updateWeighing(req.user.tenant_id, id, dto, req.user.sub);
    }
    async uploadMedia(req, id, file, type) {
        const url = `/uploads/weighings/${id}/${file?.originalname || 'media'}`;
        return this.weighingService.addMedia(req.user.tenant_id, id, {
            type: type || weighing_source_enum_1.WeighingMediaType.MANUAL_UPLOAD,
            url,
            fileSizeBytes: file?.size || null,
            capturedAt: new Date(),
        });
    }
    async batchSync(req, dto) {
        return this.weighingService.batchSync(req.user.tenant_id, dto, req.user.sub);
    }
    async findCattleByEid(req, eid) {
        const cattle = await this.weighingService.findCattleByEid(req.user.tenant_id, eid);
        if (!cattle) {
            return { found: false, eid, message: 'No cattle found with this EID tag' };
        }
        return { found: true, eid, cattle };
    }
    async registerDevice(req, dto) {
        return this.weighingService.registerDevice(req.user.tenant_id, dto);
    }
    async listDevices(req) {
        return this.weighingService.listDevices(req.user.tenant_id);
    }
    async deviceHeartbeat(id, dto, apiKey) {
        return this.weighingService.deviceHeartbeat(id, apiKey);
    }
    async revokeDevice(req, id) {
        return this.weighingService.revokeDevice(req.user.tenant_id, id);
    }
    async getBridgeStatus(req) {
        const devices = await this.weighingService.listDevices(req.user.tenant_id);
        return {
            devices: devices.map(d => ({
                id: d.id,
                name: d.name,
                type: d.type,
                status: d.status,
                lastSeenAt: d.lastSeenAt,
                ipAddress: d.ipAddress,
            })),
            pollIntervalMs: 30000,
            timestamp: new Date().toISOString(),
        };
    }
};
exports.WeighingController = WeighingController;
__decorate([
    (0, common_1.Post)('weighings'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new weighing record' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Weighing record created' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_weighing_dto_1.CreateWeighingDto]),
    __metadata("design:returntype", Promise)
], WeighingController.prototype, "createWeighing", null);
__decorate([
    (0, common_1.Get)('weighings'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'List weighing records with filters' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_weighing_dto_1.WeighingQueryDto]),
    __metadata("design:returntype", Promise)
], WeighingController.prototype, "listWeighings", null);
__decorate([
    (0, common_1.Get)('weighings/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get a single weighing record with media' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], WeighingController.prototype, "getWeighing", null);
__decorate([
    (0, common_1.Patch)('weighings/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update/correct a weighing record (creates audit trail)' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, create_weighing_dto_1.UpdateWeighingDto]),
    __metadata("design:returntype", Promise)
], WeighingController.prototype, "updateWeighing", null);
__decorate([
    (0, common_1.Post)('weighings/:id/media'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiOperation)({ summary: 'Upload photo/video to a weighing record' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.UploadedFile)()),
    __param(3, (0, common_1.Body)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object, String]),
    __metadata("design:returntype", Promise)
], WeighingController.prototype, "uploadMedia", null);
__decorate([
    (0, common_1.Post)('bridge/sync'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Batch sync offline weighing records from bridge' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_weighing_dto_1.BatchSyncWeighingDto]),
    __metadata("design:returntype", Promise)
], WeighingController.prototype, "batchSync", null);
__decorate([
    (0, common_1.Get)('cattle/by-eid/:eid'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Look up cattle by 15-digit RFID EID tag number' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Cattle found' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'No cattle found with this EID' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('eid')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], WeighingController.prototype, "findCattleByEid", null);
__decorate([
    (0, common_1.Post)('bridge/devices/register'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Register a new bridge/hardware device' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Device registered with API key' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, bridge_device_dto_1.RegisterDeviceDto]),
    __metadata("design:returntype", Promise)
], WeighingController.prototype, "registerDevice", null);
__decorate([
    (0, common_1.Get)('bridge/devices'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'List all registered hardware devices' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WeighingController.prototype, "listDevices", null);
__decorate([
    (0, common_1.Post)('bridge/devices/:id/heartbeat'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Bridge device heartbeat (no JWT needed, uses API key)' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)('apiKey')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, bridge_device_dto_1.DeviceHeartbeatDto, String]),
    __metadata("design:returntype", Promise)
], WeighingController.prototype, "deviceHeartbeat", null);
__decorate([
    (0, common_1.Delete)('bridge/devices/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Revoke/delete a registered device' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], WeighingController.prototype, "revokeDevice", null);
__decorate([
    (0, common_1.Get)('bridge/status'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get bridge status and configuration' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WeighingController.prototype, "getBridgeStatus", null);
exports.WeighingController = WeighingController = __decorate([
    (0, swagger_1.ApiTags)('Hardware Integration'),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [weighing_service_1.WeighingService])
], WeighingController);
//# sourceMappingURL=weighing.controller.js.map
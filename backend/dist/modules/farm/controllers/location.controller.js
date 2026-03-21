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
exports.LocationController = void 0;
const common_1 = require("@nestjs/common");
const location_service_1 = require("../services/location.service");
const swagger_1 = require("@nestjs/swagger");
const location_entity_1 = require("../entities/location.entity");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const application_permissions_guard_1 = require("../../../common/application-permissions/application-permissions.guard");
const application_permissions_decorator_1 = require("../../../common/application-permissions/application-permissions.decorator");
const session_user_dto_1 = require("../../auth/dto/session-user.dto");
const session_user_decorator_1 = require("../../../common/decorators/session-user.decorator");
let LocationController = class LocationController {
    constructor(locationService) {
        this.locationService = locationService;
    }
    findOne(id) {
        return this.locationService.findOne(id);
    }
    findByCattle(id, sessionUser) {
        return this.locationService.findByCattle(id, sessionUser.tenant_id);
    }
    findByDevice(id, sessionUser) {
        return this.locationService.findByDevice(id, sessionUser.tenant_id);
    }
    remove(id) {
        return this.locationService.remove(id);
    }
};
exports.LocationController = LocationController;
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a location by ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Location found',
        type: location_entity_1.Location,
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LocationController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('cattle/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a location by cattle ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Location found',
        type: location_entity_1.Location,
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, session_user_dto_1.SessionUserDto]),
    __metadata("design:returntype", void 0)
], LocationController.prototype, "findByCattle", null);
__decorate([
    (0, common_1.Get)('device/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a location by device ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Location found',
        type: location_entity_1.Location,
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, session_user_dto_1.SessionUserDto]),
    __metadata("design:returntype", void 0)
], LocationController.prototype, "findByDevice", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a location' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Location deleted successfully',
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LocationController.prototype, "remove", null);
exports.LocationController = LocationController = __decorate([
    (0, swagger_1.ApiTags)('Locations'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.Controller)('locations'),
    (0, application_permissions_decorator_1.RequireEntity)('locations'),
    (0, application_permissions_decorator_1.RequireModule)('FARM'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, application_permissions_guard_1.ApplicationPermissionsGuard),
    __metadata("design:paramtypes", [location_service_1.LocationService])
], LocationController);
//# sourceMappingURL=location.controller.js.map
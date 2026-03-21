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
exports.ColorCharacteristicsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const application_permissions_decorator_1 = require("../../../common/application-permissions/application-permissions.decorator");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const application_permissions_guard_1 = require("../../../common/application-permissions/application-permissions.guard");
const session_user_decorator_1 = require("../../../common/decorators/session-user.decorator");
const session_user_dto_1 = require("../../auth/dto/session-user.dto");
const color_characteristics_service_1 = require("../services/color-characteristics.service");
let ColorCharacteristicsController = class ColorCharacteristicsController {
    constructor(colorCharacteristicsService) {
        this.colorCharacteristicsService = colorCharacteristicsService;
    }
    getAllColors(sessionUser) {
        return this.colorCharacteristicsService.getAllColors();
    }
    getAllCharacteristics(sessionUser) {
        return this.colorCharacteristicsService.getAllCharacteristics();
    }
};
exports.ColorCharacteristicsController = ColorCharacteristicsController;
__decorate([
    (0, common_1.Get)('color'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all colors' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Colors retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid request body' }),
    (0, application_permissions_decorator_1.RequireAction)('read'),
    __param(0, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_dto_1.SessionUserDto]),
    __metadata("design:returntype", void 0)
], ColorCharacteristicsController.prototype, "getAllColors", null);
__decorate([
    (0, common_1.Get)('characteristic'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all characteristics' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Characteristics retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid request body' }),
    (0, application_permissions_decorator_1.RequireAction)('read'),
    __param(0, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_dto_1.SessionUserDto]),
    __metadata("design:returntype", void 0)
], ColorCharacteristicsController.prototype, "getAllCharacteristics", null);
exports.ColorCharacteristicsController = ColorCharacteristicsController = __decorate([
    (0, swagger_1.ApiTags)('Color-Characteristics'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.Controller)('color-characteristics'),
    (0, application_permissions_decorator_1.RequireEntity)('cattle'),
    (0, application_permissions_decorator_1.RequireModule)('FARM'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, application_permissions_guard_1.ApplicationPermissionsGuard),
    __metadata("design:paramtypes", [color_characteristics_service_1.ColorCharacteristicsService])
], ColorCharacteristicsController);
//# sourceMappingURL=color-characteristics.controller.js.map
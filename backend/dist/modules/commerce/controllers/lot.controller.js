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
exports.LotController = void 0;
const common_1 = require("@nestjs/common");
const lot_service_1 = require("../services/lot.service");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const application_permissions_guard_1 = require("../../../common/application-permissions/application-permissions.guard");
const session_user_decorator_1 = require("../../../common/decorators/session-user.decorator");
const session_user_dto_1 = require("../../auth/dto/session-user.dto");
const swagger_1 = require("@nestjs/swagger");
const lot_response_dto_1 = require("../dto/lot-response.dto");
const application_permissions_decorator_1 = require("../../../common/application-permissions/application-permissions.decorator");
let LotController = class LotController {
    constructor(lotService) {
        this.lotService = lotService;
    }
    async findOne(id, user) {
        return lot_response_dto_1.LotResponseDto.toLotResponse(await this.lotService.findOne(id, user.tenant_id));
    }
    async findByPurchase(idPurchase, user) {
        const lots = await this.lotService.findByPurchaseId(idPurchase, user.tenant_id);
        return lots.map((lot) => lot_response_dto_1.LotResponseDto.toLotResponse(lot));
    }
};
exports.LotController = LotController;
__decorate([
    (0, common_1.Get)(':id'),
    (0, application_permissions_decorator_1.RequireAction)('read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a lot by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: lot_response_dto_1.LotResponseDto }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, session_user_dto_1.SessionUserDto]),
    __metadata("design:returntype", Promise)
], LotController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('/purchase/:idPurchase'),
    (0, application_permissions_decorator_1.RequireAction)('read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all lots for a given purchase ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: [lot_response_dto_1.LotResponseDto] }),
    __param(0, (0, common_1.Param)('idPurchase')),
    __param(1, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, session_user_dto_1.SessionUserDto]),
    __metadata("design:returntype", Promise)
], LotController.prototype, "findByPurchase", null);
exports.LotController = LotController = __decorate([
    (0, swagger_1.ApiTags)('Lots'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.Controller)('lots'),
    (0, application_permissions_decorator_1.RequireEntity)('lots'),
    (0, application_permissions_decorator_1.RequireModule)('COMMERCE'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, application_permissions_guard_1.ApplicationPermissionsGuard),
    __metadata("design:paramtypes", [lot_service_1.LotService])
], LotController);
//# sourceMappingURL=lot.controller.js.map
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
var PurchaseController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PurchaseController = void 0;
const common_1 = require("@nestjs/common");
const purchase_service_1 = require("../services/purchase.service");
const create_purchase_dto_1 = require("../dto/create-purchase.dto");
const update_purchase_dto_1 = require("../dto/update-purchase.dto");
const session_user_decorator_1 = require("../../../common/decorators/session-user.decorator");
const session_user_dto_1 = require("../../auth/dto/session-user.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const application_permissions_guard_1 = require("../../../common/application-permissions/application-permissions.guard");
const swagger_1 = require("@nestjs/swagger");
const purchase_response_dto_1 = require("../dto/purchase-response.dto");
const application_permissions_decorator_1 = require("../../../common/application-permissions/application-permissions.decorator");
const paged_response_dto_1 = require("../../../shared/dto/paged-response.dto");
const purchase_list_query_dto_1 = require("../dto/purchase-list.query.dto");
let PurchaseController = PurchaseController_1 = class PurchaseController {
    purchaseService;
    logger = new common_1.Logger(PurchaseController_1.name);
    constructor(purchaseService) {
        this.purchaseService = purchaseService;
    }
    async createPurchase(dto, user) {
        const purchase = await this.purchaseService.createPurchase(dto, user.tenant_id, user.sub);
        return purchase_response_dto_1.PurchaseResponseDto.toPurchaseResponse(purchase);
    }
    async updatePurchase(id, dto, user) {
        const purchase = await this.purchaseService.updatePurchase(id, dto, user.tenant_id, user.sub);
        return purchase_response_dto_1.PurchaseResponseDto.toPurchaseResponse(purchase);
    }
    async list(user, q) {
        this.logger.debug("COMPRAS FILTRADAS ");
        const { items, total, page, limit } = await this.purchaseService.listPaged(user.tenant_id, q);
        const resp = paged_response_dto_1.PagedResponseDto.of(page, limit, total, items);
        this.logger.debug(resp);
        return resp;
    }
    async findById(id, user) {
        return purchase_response_dto_1.PurchaseResponseDto.toPurchaseResponse(await this.purchaseService.findById(id, user.tenant_id));
    }
    async deleteById(id, user) {
        await this.purchaseService.deleteById(id, user.tenant_id);
    }
};
exports.PurchaseController = PurchaseController;
__decorate([
    (0, common_1.Post)(),
    (0, application_permissions_decorator_1.RequireAction)('create'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new purchase' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiResponse)({ status: 201, type: purchase_response_dto_1.PurchaseResponseDto }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_purchase_dto_1.CreatePurchaseDto,
        session_user_dto_1.SessionUserDto]),
    __metadata("design:returntype", Promise)
], PurchaseController.prototype, "createPurchase", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, application_permissions_decorator_1.RequireAction)('update'),
    (0, swagger_1.ApiOperation)({ summary: 'Update an existing purchase' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: purchase_response_dto_1.PurchaseResponseDto }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_purchase_dto_1.UpdatePurchaseDto,
        session_user_dto_1.SessionUserDto]),
    __metadata("design:returntype", Promise)
], PurchaseController.prototype, "updatePurchase", null);
__decorate([
    (0, common_1.Get)(),
    (0, application_permissions_decorator_1.RequireAction)('read'),
    (0, swagger_1.ApiOperation)({ summary: 'List purchases for tenant' }),
    (0, swagger_1.ApiOkResponse)({ type: (paged_response_dto_1.PagedResponseDto) }),
    __param(0, (0, session_user_decorator_1.SessionUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_dto_1.SessionUserDto,
        purchase_list_query_dto_1.PurchaseListQueryDto]),
    __metadata("design:returntype", Promise)
], PurchaseController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, application_permissions_decorator_1.RequireAction)('read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a purchase by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: purchase_response_dto_1.PurchaseResponseDto }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, session_user_dto_1.SessionUserDto]),
    __metadata("design:returntype", Promise)
], PurchaseController.prototype, "findById", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, application_permissions_decorator_1.RequireAction)('delete'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a purchase by ID' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiResponse)({ status: 204 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, session_user_dto_1.SessionUserDto]),
    __metadata("design:returntype", Promise)
], PurchaseController.prototype, "deleteById", null);
exports.PurchaseController = PurchaseController = PurchaseController_1 = __decorate([
    (0, swagger_1.ApiTags)('Purchases'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.Controller)('purchases'),
    (0, application_permissions_decorator_1.RequireEntity)('purchases'),
    (0, application_permissions_decorator_1.RequireModule)('COMMERCE'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, application_permissions_guard_1.ApplicationPermissionsGuard),
    __metadata("design:paramtypes", [purchase_service_1.PurchaseService])
], PurchaseController);
//# sourceMappingURL=purchase.controller.js.map
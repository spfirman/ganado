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
exports.SalesController = void 0;
const common_1 = require("@nestjs/common");
const sales_service_1 = require("../services/sales.service");
const create_sale_dto_1 = require("../dto/create-sale.dto");
const get_sales_query_dto_1 = require("../dto/get-sales-query.dto");
const update_sale_dto_1 = require("../dto/update-sale.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const session_user_decorator_1 = require("../../../common/decorators/session-user.decorator");
const session_user_dto_1 = require("../../auth/dto/session-user.dto");
const application_permissions_guard_1 = require("../../../common/application-permissions/application-permissions.guard");
const application_permissions_decorator_1 = require("../../../common/application-permissions/application-permissions.decorator");
const swagger_1 = require("@nestjs/swagger");
let SalesController = class SalesController {
    salesService;
    constructor(salesService) {
        this.salesService = salesService;
    }
    async create(createSaleDto, user) {
        createSaleDto.idTenant = user.tenant_id;
        createSaleDto.createdBy = user.sub;
        return await this.salesService.createSale(createSaleDto);
    }
    async findAll(query, user) {
        return await this.salesService.findAll(user.tenant_id, query);
    }
    async findOne(id, user) {
        return await this.salesService.findOne(user.tenant_id, id);
    }
    async update(id, updateSaleDto, user) {
        return await this.salesService.update(user.tenant_id, id, updateSaleDto);
    }
};
exports.SalesController = SalesController;
__decorate([
    (0, common_1.Post)(),
    (0, application_permissions_decorator_1.RequireAction)('create'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new Sale' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_sale_dto_1.CreateSaleDto,
        session_user_dto_1.SessionUserDto]),
    __metadata("design:returntype", Promise)
], SalesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, application_permissions_decorator_1.RequireAction)('read'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_sales_query_dto_1.GetSalesQueryDto, session_user_dto_1.SessionUserDto]),
    __metadata("design:returntype", Promise)
], SalesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, application_permissions_decorator_1.RequireAction)('read'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, session_user_dto_1.SessionUserDto]),
    __metadata("design:returntype", Promise)
], SalesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, application_permissions_decorator_1.RequireAction)('update'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_sale_dto_1.UpdateSaleDto, session_user_dto_1.SessionUserDto]),
    __metadata("design:returntype", Promise)
], SalesController.prototype, "update", null);
exports.SalesController = SalesController = __decorate([
    (0, swagger_1.ApiTags)('Sales'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.Controller)('sales'),
    (0, application_permissions_decorator_1.RequireEntity)('sales'),
    (0, application_permissions_decorator_1.RequireModule)('COMMERCE'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, application_permissions_guard_1.ApplicationPermissionsGuard),
    __metadata("design:paramtypes", [sales_service_1.SalesService])
], SalesController);
//# sourceMappingURL=sales.controller.js.map
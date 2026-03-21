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
exports.ProviderController = void 0;
const common_1 = require("@nestjs/common");
const provider_service_1 = require("../services/provider.service");
const swagger_1 = require("@nestjs/swagger");
const application_permissions_guard_1 = require("../../../common/application-permissions/application-permissions.guard");
const session_user_decorator_1 = require("../../../common/decorators/session-user.decorator");
const session_user_dto_1 = require("../../auth/dto/session-user.dto");
const application_permissions_decorator_1 = require("../../../common/application-permissions/application-permissions.decorator");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const create_provider_dto_1 = require("../dto/create-provider.dto");
const update_provider_dto_1 = require("../dto/update-provider.dto");
const provider_response_dto_1 = require("../dto/provider-response.dto");
let ProviderController = class ProviderController {
    constructor(providerService) {
        this.providerService = providerService;
    }
    async create(body, user) {
        const provider = await this.providerService.createProvider({
            ...body,
            idTenant: user.tenant_id,
        });
        return provider_response_dto_1.ProviderResponseDto.toProviderResponse(provider);
    }
    async searchByName(user, name, type) {
        const providers = await this.providerService.searchByName(name, user.tenant_id);
        const filtered = type ? providers.filter((p) => p.type === type) : providers;
        return filtered.map(provider_response_dto_1.ProviderResponseDto.toProviderResponse);
    }
    async searchByNit(query, session) {
        const results = await this.providerService.searchProvidersByNit(query, session.tenant_id);
        return results.map(provider_response_dto_1.ProviderResponseDto.toProviderResponse);
    }
    async findById(id, user) {
        return provider_response_dto_1.ProviderResponseDto.toProviderResponse(await this.providerService.findById(id, user.tenant_id));
    }
    async findByNit(nit, user) {
        return provider_response_dto_1.ProviderResponseDto.toProviderResponse(await this.providerService.findByNit(nit, user.tenant_id));
    }
    async findAll(user, type) {
        const providers = await this.providerService.findAll(user.tenant_id);
        const filtered = type ? providers.filter((p) => p.type === type) : providers;
        return filtered.map(provider_response_dto_1.ProviderResponseDto.toProviderResponse);
    }
    async updateById(id, data, user) {
        await this.providerService.updateById(id, user.tenant_id, data);
    }
    async updateByNit(nit, data, user) {
        if ('nit' in data && data.nit !== undefined && data.nit !== null) {
            throw new common_1.BadRequestException('NIT update not allowed in this endpoint');
        }
        await this.providerService.updateByNit(nit, user.tenant_id, data);
    }
    async deleteById(id, user) {
        await this.providerService.deleteById(id, user.tenant_id);
    }
    async deleteByNit(nit, user) {
        await this.providerService.deleteByNit(nit, user.tenant_id);
    }
};
exports.ProviderController = ProviderController;
__decorate([
    (0, common_1.Post)(),
    (0, application_permissions_decorator_1.RequireAction)('create'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new provider' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Provider created successfully',
        type: provider_response_dto_1.ProviderResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'NIT already exists for this tenant' }),
    (0, swagger_1.ApiBody)({
        type: create_provider_dto_1.CreateProviderDto,
        required: true,
        examples: {
            example1: {
                summary: 'Mandatory fields',
                value: {
                    nit: '1234567890',
                    name: 'Provider 1',
                },
            },
        },
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_provider_dto_1.CreateProviderDto,
        session_user_dto_1.SessionUserDto]),
    __metadata("design:returntype", Promise)
], ProviderController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('search'),
    (0, application_permissions_decorator_1.RequireAction)('read'),
    (0, swagger_1.ApiOperation)({ summary: 'Search providers by name' }),
    (0, swagger_1.ApiQuery)({ name: 'name', required: true, description: 'Search term for provider name' }),
    (0, swagger_1.ApiQuery)({
        name: 'type',
        required: false,
        description: 'Filter by provider type (BUYER, TRANSPORTER, VET, OTHER)',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of matching providers with contact info',
        type: [provider_response_dto_1.ProviderResponseDto],
    }),
    __param(0, (0, session_user_decorator_1.SessionUser)()),
    __param(1, (0, common_1.Query)('name')),
    __param(2, (0, common_1.Query)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_dto_1.SessionUserDto, String, String]),
    __metadata("design:returntype", Promise)
], ProviderController.prototype, "searchByName", null);
__decorate([
    (0, common_1.Get)('search/by-nit'),
    (0, application_permissions_decorator_1.RequireAction)('read'),
    (0, swagger_1.ApiQuery)({ name: 'query', required: true, description: 'Fragmento parcial del NIT' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Proveedores coincidentes con fragmento del NIT',
        type: [provider_response_dto_1.ProviderResponseDto],
    }),
    __param(0, (0, common_1.Query)('query')),
    __param(1, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, session_user_dto_1.SessionUserDto]),
    __metadata("design:returntype", Promise)
], ProviderController.prototype, "searchByNit", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, application_permissions_decorator_1.RequireAction)('read'),
    (0, swagger_1.ApiOperation)({ summary: 'Find provider by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Provider found', type: provider_response_dto_1.ProviderResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Provider not found by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, session_user_dto_1.SessionUserDto]),
    __metadata("design:returntype", Promise)
], ProviderController.prototype, "findById", null);
__decorate([
    (0, common_1.Get)('nit/:nit'),
    (0, application_permissions_decorator_1.RequireAction)('read'),
    (0, swagger_1.ApiOperation)({ summary: 'Find provider by NIT' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Provider found', type: provider_response_dto_1.ProviderResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Provider not found by NIT' }),
    __param(0, (0, common_1.Param)('nit')),
    __param(1, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, session_user_dto_1.SessionUserDto]),
    __metadata("design:returntype", Promise)
], ProviderController.prototype, "findByNit", null);
__decorate([
    (0, common_1.Get)(),
    (0, application_permissions_decorator_1.RequireAction)('read'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all providers by tenant' }),
    (0, swagger_1.ApiQuery)({
        name: 'type',
        required: false,
        description: 'Filter by provider type (BUYER, TRANSPORTER, VET, OTHER, PROVIDER)',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of providers', type: [provider_response_dto_1.ProviderResponseDto] }),
    __param(0, (0, session_user_decorator_1.SessionUser)()),
    __param(1, (0, common_1.Query)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_dto_1.SessionUserDto, String]),
    __metadata("design:returntype", Promise)
], ProviderController.prototype, "findAll", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, application_permissions_decorator_1.RequireAction)('update'),
    (0, swagger_1.ApiOperation)({ summary: 'Update provider by ID' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Provider updated' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Provider not found by ID' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'NIT already exists for this tenant' }),
    (0, swagger_1.ApiBody)({
        type: update_provider_dto_1.UpdateProviderDto,
        required: true,
        examples: {
            example1: {
                summary: 'Nit only',
                value: {
                    nit: '1234567890',
                },
            },
            example2: {
                summary: 'Name only',
                value: {
                    name: 'Provider 1',
                },
            },
            example3: {
                summary: 'All fields',
                value: {
                    nit: '1234567890',
                    name: 'Provider 1',
                },
            },
        },
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_provider_dto_1.UpdateProviderDto,
        session_user_dto_1.SessionUserDto]),
    __metadata("design:returntype", Promise)
], ProviderController.prototype, "updateById", null);
__decorate([
    (0, common_1.Put)('nit/:nit'),
    (0, application_permissions_decorator_1.RequireAction)('update'),
    (0, swagger_1.ApiOperation)({ summary: 'Update provider by NIT (NIT cannot be changed)' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Provider updated' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'NIT update not allowed in this endpoint' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Provider not found by NIT' }),
    (0, swagger_1.ApiBody)({
        type: update_provider_dto_1.UpdateProviderDto,
        required: true,
        examples: {
            example1: {
                summary: 'Name only',
                value: {
                    name: 'Provider 1',
                },
            },
        },
    }),
    __param(0, (0, common_1.Param)('nit')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_provider_dto_1.UpdateProviderDto,
        session_user_dto_1.SessionUserDto]),
    __metadata("design:returntype", Promise)
], ProviderController.prototype, "updateByNit", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, application_permissions_decorator_1.RequireAction)('delete'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete provider by ID' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Provider deleted' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, session_user_dto_1.SessionUserDto]),
    __metadata("design:returntype", Promise)
], ProviderController.prototype, "deleteById", null);
__decorate([
    (0, common_1.Delete)('nit/:nit'),
    (0, application_permissions_decorator_1.RequireAction)('delete'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete provider by NIT' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Provider deleted' }),
    __param(0, (0, common_1.Param)('nit')),
    __param(1, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, session_user_dto_1.SessionUserDto]),
    __metadata("design:returntype", Promise)
], ProviderController.prototype, "deleteByNit", null);
exports.ProviderController = ProviderController = __decorate([
    (0, swagger_1.ApiTags)('Provider'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.Controller)('providers'),
    (0, application_permissions_decorator_1.RequireEntity)('providers'),
    (0, application_permissions_decorator_1.RequireModule)('COMMERCE'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, application_permissions_guard_1.ApplicationPermissionsGuard),
    __metadata("design:paramtypes", [provider_service_1.ProviderService])
], ProviderController);
//# sourceMappingURL=provider.controller.js.map
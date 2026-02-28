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
var BrandController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrandController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const brand_service_1 = require("../services/brand.service");
const create_brand_dto_1 = require("../dto/create-brand.dto");
const update_brand_dto_1 = require("../dto/update-brand.dto");
const brand_response_dto_1 = require("../dto/brand-response.dto");
const multer_1 = require("multer");
const sync_brand_dto_1 = require("../dto/sync-brand.dto");
const swagger_1 = require("@nestjs/swagger");
const application_permissions_decorator_1 = require("../../../common/application-permissions/application-permissions.decorator");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const application_permissions_guard_1 = require("../../../common/application-permissions/application-permissions.guard");
const session_user_decorator_1 = require("../../../common/decorators/session-user.decorator");
const session_user_dto_1 = require("../../auth/dto/session-user.dto");
const sync_brand_dto_2 = require("../dto/sync-brand.dto");
const common_2 = require("@nestjs/common");
let BrandController = BrandController_1 = class BrandController {
    brandService;
    logger = new common_2.Logger(BrandController_1.name);
    constructor(brandService) {
        this.brandService = brandService;
    }
    async create(sessionUser, dto, file) {
        if (!file || !file.buffer || file.size === 0) {
            throw new common_1.BadRequestException('The image is requested');
        }
        if ('image' in dto) {
            delete dto.image;
        }
        const brand = await this.brandService.create(sessionUser.tenant_id, dto, file);
        return brand_response_dto_1.BrandResponseDto.toResponseDto(brand);
    }
    async findOne(id, sessionUser) {
        const brand = await this.brandService.findByIdOrFail(sessionUser.tenant_id, id);
        return brand_response_dto_1.BrandResponseDto.toResponseDto(brand);
    }
    async update(id, sessionUser, dto, file) {
        if (file && file.size === 0) {
            throw new common_1.BadRequestException('La imagen no puede estar vacía');
        }
        if ('image' in dto) {
            delete dto.image;
        }
        const brand = await this.brandService.update(sessionUser.tenant_id, id, dto, file);
        return brand_response_dto_1.BrandResponseDto.toResponseDto(brand);
    }
    remove(id, sessionUser) {
        return this.brandService.remove(sessionUser.tenant_id, id);
    }
    async list(sessionUser) {
        const brands = await this.brandService.findAll(sessionUser.tenant_id);
        return brands.map(brand_response_dto_1.BrandResponseDto.toResponseDto);
    }
    async syncBrands(sessionUser, brandsJson, files) {
        const brands = await sync_brand_dto_2.SyncBrandDto.parseAndValidateBrands(brandsJson);
        const filesMap = new Map(files.map(f => [f.fieldname, f]));
        const results = await this.brandService.syncBrands(sessionUser.tenant_id, brands, filesMap);
        return { results };
    }
};
exports.BrandController = BrandController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image', {
        storage: (0, multer_1.memoryStorage)(),
        fileFilter: (req, file, cb) => {
            const allowed = ['image/png', 'image/jpg', 'image/jpeg'];
            if (!allowed.includes(file.mimetype)) {
                return cb(new common_1.BadRequestException('Solo se permiten imágenes PNG o JPEG'), false);
            }
            cb(null, true);
        },
    })),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new brand' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Brand created successfully', type: brand_response_dto_1.BrandResponseDto }),
    (0, application_permissions_decorator_1.RequireAction)('create'),
    (0, swagger_1.ApiBody)({
        type: create_brand_dto_1.CreateBrandDto, required: true, examples: {
            example1: {
                summary: 'Basic brand creation',
                value: { name: 'Marca A' },
            },
            example2: {
                summary: 'Another brand',
                value: { name: 'Marca B' },
            },
        }
    }),
    __param(0, (0, session_user_decorator_1.SessionUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_dto_1.SessionUserDto, create_brand_dto_1.CreateBrandDto, Object]),
    __metadata("design:returntype", Promise)
], BrandController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a brand by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Brand found', type: brand_response_dto_1.BrandResponseDto }),
    (0, application_permissions_decorator_1.RequireAction)('read'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, session_user_dto_1.SessionUserDto]),
    __metadata("design:returntype", Promise)
], BrandController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a brand' }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image', {
        storage: (0, multer_1.memoryStorage)(),
        fileFilter: (req, file, cb) => {
            const allowed = ['image/png', 'image/jpeg'];
            if (!allowed.includes(file.mimetype)) {
                return cb(new common_1.BadRequestException('Solo se permiten imágenes PNG o JPEG'), false);
            }
            cb(null, true);
        },
    })),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Brand updated', type: brand_response_dto_1.BrandResponseDto }),
    (0, application_permissions_decorator_1.RequireAction)('update'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, session_user_decorator_1.SessionUser)()),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, session_user_dto_1.SessionUserDto, update_brand_dto_1.UpdateBrandDto, Object]),
    __metadata("design:returntype", Promise)
], BrandController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a brand' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Brand deleted successfully' }),
    (0, application_permissions_decorator_1.RequireAction)('delete'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, session_user_dto_1.SessionUserDto]),
    __metadata("design:returntype", void 0)
], BrandController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List all brands' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of brands', type: [brand_response_dto_1.BrandResponseDto] }),
    (0, application_permissions_decorator_1.RequireAction)('read'),
    __param(0, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_dto_1.SessionUserDto]),
    __metadata("design:returntype", Promise)
], BrandController.prototype, "list", null);
__decorate([
    (0, common_1.Post)('sync'),
    (0, common_1.UseInterceptors)((0, platform_express_1.AnyFilesInterceptor)()),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, application_permissions_decorator_1.RequireAction)('create'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                brands: {
                    type: 'string',
                    description: 'Lista JSON de marcas a sincronizar',
                    example: JSON.stringify([
                        { id: 'uuid-local-1', idTenant: 'tenant-uuid', name: 'Marca A' },
                        { id: 'uuid-local-2', idTenant: 'tenant-uuid', name: 'Marca B' }
                    ])
                },
                image_uuid_local_1: {
                    type: 'string',
                    format: 'binary'
                },
                image_uuid_local_2: {
                    type: 'string',
                    format: 'binary'
                }
            }
        }
    }),
    (0, swagger_1.ApiOperation)({ summary: 'Sync offline-created brands to backend' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Sync results', type: sync_brand_dto_1.SyncBrandResponseDto }),
    __param(0, (0, session_user_decorator_1.SessionUser)()),
    __param(1, (0, common_1.Body)('brands')),
    __param(2, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_dto_1.SessionUserDto, String, Array]),
    __metadata("design:returntype", Promise)
], BrandController.prototype, "syncBrands", null);
exports.BrandController = BrandController = BrandController_1 = __decorate([
    (0, swagger_1.ApiTags)('Brands'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.Controller)('brands'),
    (0, application_permissions_decorator_1.RequireEntity)('brands'),
    (0, application_permissions_decorator_1.RequireModule)('FARM'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, application_permissions_guard_1.ApplicationPermissionsGuard),
    __metadata("design:paramtypes", [brand_service_1.BrandService])
], BrandController);
//# sourceMappingURL=brand.controller.js.map
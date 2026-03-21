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
exports.ReceptionController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const application_permissions_decorator_1 = require("../../../common/application-permissions/application-permissions.decorator");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const application_permissions_guard_1 = require("../../../common/application-permissions/application-permissions.guard");
const session_user_decorator_1 = require("../../../common/decorators/session-user.decorator");
const session_user_dto_1 = require("../../auth/dto/session-user.dto");
const receptions_service_1 = require("../services/receptions.service");
const reception_response_dto_1 = require("../dto/reception-response.dto");
const receive_cattle_request_dto_1 = require("../dto/receive-cattle-request.dto");
const receive_cattle_response_dto_1 = require("../dto/receive-cattle-response.dto");
const cattle_entity_1 = require("../../farm/entities/cattle.entity");
const device_entity_1 = require("../../production-center/entities/device.entity");
const cattle_service_1 = require("../../farm/services/cattle.service");
const simple_event_entity_1 = require("../../massive-events/entities/simple-event.entity");
const simple_event_service_1 = require("../../massive-events/services/simple-event.service");
const update_simple_events_dto_1 = require("../../massive-events/dto/update-simple-events.dto");
const purchase_response_dto_1 = require("../../commerce/dto/purchase-response.dto");
const update_purchase_status_dto_1 = require("../../commerce/dto/update-purchase-status.dto");
const purchase_service_1 = require("../../commerce/services/purchase.service");
let ReceptionController = class ReceptionController {
    constructor(receptionsService, cattleService, simpleEventService, purchaseService) {
        this.receptionsService = receptionsService;
        this.cattleService = cattleService;
        this.simpleEventService = simpleEventService;
        this.purchaseService = purchaseService;
    }
    async numberExists(sessionUser, number) {
        if (!number?.trim()) {
            throw new common_1.BadRequestException('number is required');
        }
        const cattle = await this.cattleService.findByNumber(sessionUser.tenant_id, number.trim());
        const exists = !!cattle && (cattle.status === cattle_entity_1.CattleStatus.ACTIVE || cattle.status === cattle_entity_1.CattleStatus.LOST);
        return { exists };
    }
    async eartagExists(sessionUser, eartag) {
        if (!eartag?.trim()) {
            throw new common_1.BadRequestException('eartag is required');
        }
        var cattle = await this.cattleService.findByAnyEartag(sessionUser.tenant_id, eartag.trim());
        const exists = !!cattle && (cattle.status === cattle_entity_1.CattleStatus.ACTIVE || cattle.status === cattle_entity_1.CattleStatus.LOST);
        return { exists };
    }
    async findOrCreateReception(sessionUser, idPurchase) {
        console.log('idPurchase - controller', idPurchase);
        const receptionInfo = await this.receptionsService.findOrCreateReceptionByIdPurchase(sessionUser.tenant_id, idPurchase, sessionUser.sub);
        const receptionResponseDto = reception_response_dto_1.ReceptionResponseDto.toResponseDto(receptionInfo);
        return receptionResponseDto;
    }
    async searchDevices(sessionUser, q) {
        return this.receptionsService.searchDevices(sessionUser.tenant_id, q);
    }
    async receiveCattle(sessionUser, dto) {
        console.log('dto - controller', dto);
        return this.receptionsService.receiveCattle_Transaction(sessionUser.tenant_id, sessionUser.sub, dto);
    }
    async assignLotCattle(sessionUser, dto) {
        return this.receptionsService.assignLotCattle(sessionUser.tenant_id, dto);
    }
    async nextNumber(sessionUser, number) {
        return this.receptionsService.nextNumber(sessionUser.tenant_id, number);
    }
    async updateStatus(id, dto, user) {
        const purchase = await this.purchaseService.updateStatus(id, dto.status, user.tenant_id, user.sub);
        return purchase_response_dto_1.PurchaseResponseDto.toPurchaseResponse(purchase);
    }
    async updateSimpleEvent(sessionUser, id, dto) {
        return this.simpleEventService.updateSimpleEvent(sessionUser.tenant_id, id, dto);
    }
};
exports.ReceptionController = ReceptionController;
__decorate([
    (0, common_1.Get)('number-exists'),
    (0, application_permissions_decorator_1.RequireAction)('read'),
    __param(0, (0, session_user_decorator_1.SessionUser)()),
    __param(1, (0, common_1.Query)('number')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_dto_1.SessionUserDto, String]),
    __metadata("design:returntype", Promise)
], ReceptionController.prototype, "numberExists", null);
__decorate([
    (0, common_1.Get)('eartag-exists'),
    (0, application_permissions_decorator_1.RequireAction)('read'),
    __param(0, (0, session_user_decorator_1.SessionUser)()),
    __param(1, (0, common_1.Query)('eartag')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_dto_1.SessionUserDto, String]),
    __metadata("design:returntype", Promise)
], ReceptionController.prototype, "eartagExists", null);
__decorate([
    (0, common_1.Get)(':idPurchase'),
    (0, swagger_1.ApiOperation)({ summary: 'Find or create a reception by purchase id' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Reception found or created successfully', type: reception_response_dto_1.ReceptionResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid request body' }),
    (0, application_permissions_decorator_1.RequireAction)('create'),
    __param(0, (0, session_user_decorator_1.SessionUser)()),
    __param(1, (0, common_1.Param)('idPurchase')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_dto_1.SessionUserDto, String]),
    __metadata("design:returntype", Promise)
], ReceptionController.prototype, "findOrCreateReception", null);
__decorate([
    (0, common_1.Get)('search-devices/by-query'),
    (0, swagger_1.ApiOperation)({ summary: 'Search devices by name or deveui' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Devices found', type: [device_entity_1.Device] }),
    (0, application_permissions_decorator_1.RequireAction)('read'),
    __param(0, (0, session_user_decorator_1.SessionUser)()),
    __param(1, (0, common_1.Query)('q')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_dto_1.SessionUserDto, String]),
    __metadata("design:returntype", Promise)
], ReceptionController.prototype, "searchDevices", null);
__decorate([
    (0, common_1.Post)('receive-cattle'),
    (0, swagger_1.ApiOperation)({ summary: 'Receive cattle to a reception' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Cattle received successfully', type: receive_cattle_response_dto_1.ReceiveCattleResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid request body' }),
    (0, application_permissions_decorator_1.RequireAction)('create'),
    (0, swagger_1.ApiBody)({
        type: receive_cattle_request_dto_1.ReceiveCattleRequestDto,
        examples: {
            ReceiveCattleRequestDto: {
                value: {
                    number: 'C-001',
                    receivedWeight: 250.5,
                    idPurchase: 'uuid-purchase-123',
                    purchaseWeight: 254.0,
                    purchasePrice: 1900000,
                    idLot: 'uuid-lot-456',
                    idBrand: 'uuid-brand-789',
                    color: 'color_enum',
                    characteristicsIds: ['char_enum_1', 'char_enum_2'],
                    eartagLeft: 'ET-12345',
                    eartagRight: 'ET-12346',
                    idDevice: 'uuid-device-999',
                    castrated: true,
                    hasHorn: true,
                    birthDateAprx: '2024-01-15',
                    gender: 'gender_enum',
                    comments: 'Initial reception check completed.',
                    idProvider: 'uuid-provider-123',
                    idSimpleEvents: ['uuid-simple-event-1', 'uuid-simple-event-2'],
                },
            },
        },
    }),
    __param(0, (0, session_user_decorator_1.SessionUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_dto_1.SessionUserDto,
        receive_cattle_request_dto_1.ReceiveCattleRequestDto]),
    __metadata("design:returntype", Promise)
], ReceptionController.prototype, "receiveCattle", null);
__decorate([
    (0, common_1.Patch)('assign-lot-cattle'),
    (0, swagger_1.ApiOperation)({ summary: 'Assign a lot to a cattle' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Cattle updated successfully', type: cattle_entity_1.Cattle }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid request body' }),
    (0, application_permissions_decorator_1.RequireAction)('update'),
    (0, swagger_1.ApiBody)({
        type: receive_cattle_request_dto_1.UpdateLotCattleRequestDto,
        examples: {
            UpdateLotCattleRequestDto: {
                value: {
                    idCattle: 'uuid-cattle-123',
                    idLot: 'uuid-lot-456',
                },
            },
        },
    }),
    __param(0, (0, session_user_decorator_1.SessionUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_dto_1.SessionUserDto,
        receive_cattle_request_dto_1.UpdateLotCattleRequestDto]),
    __metadata("design:returntype", Promise)
], ReceptionController.prototype, "assignLotCattle", null);
__decorate([
    (0, common_1.Get)('next-number/:number'),
    (0, swagger_1.ApiOperation)({ summary: 'Get the next number for a reception' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Next number found successfully', type: Number }),
    (0, application_permissions_decorator_1.RequireAction)('read'),
    __param(0, (0, session_user_decorator_1.SessionUser)()),
    __param(1, (0, common_1.Param)('number')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_dto_1.SessionUserDto, String]),
    __metadata("design:returntype", Promise)
], ReceptionController.prototype, "nextNumber", null);
__decorate([
    (0, common_1.Patch)('purchase-status/:id'),
    (0, application_permissions_decorator_1.RequireAction)('update'),
    (0, swagger_1.ApiOperation)({ summary: 'Update purchase status' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: purchase_response_dto_1.PurchaseResponseDto }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_purchase_status_dto_1.UpdatePurchaseStatusDto,
        session_user_dto_1.SessionUserDto]),
    __metadata("design:returntype", Promise)
], ReceptionController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Put)('update-simple-event/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update Reception simple event' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Simple event updated successfully', type: simple_event_entity_1.SimpleEvent }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid request body' }),
    (0, application_permissions_decorator_1.RequireAction)('update'),
    (0, swagger_1.ApiBody)({
        type: update_simple_events_dto_1.UpdateSimpleEventDto,
        examples: {
            UpdateSimpleEventDto: {
                value: {
                    data: { brandId: 'uuid-brand', brandName: 'Brand Name' },
                    isActive: true,
                },
            },
        },
    }),
    __param(0, (0, session_user_decorator_1.SessionUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_dto_1.SessionUserDto, String, update_simple_events_dto_1.UpdateSimpleEventDto]),
    __metadata("design:returntype", Promise)
], ReceptionController.prototype, "updateSimpleEvent", null);
exports.ReceptionController = ReceptionController = __decorate([
    (0, swagger_1.ApiTags)('Purchase reception'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.Controller)('purchase-receptions'),
    (0, application_permissions_decorator_1.RequireEntity)('receptions'),
    (0, application_permissions_decorator_1.RequireModule)('RECEPTION'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, application_permissions_guard_1.ApplicationPermissionsGuard),
    __metadata("design:paramtypes", [receptions_service_1.ReceptionsService,
        cattle_service_1.CattleService,
        simple_event_service_1.SimpleEventService,
        purchase_service_1.PurchaseService])
], ReceptionController);
//# sourceMappingURL=purchase-reception.controller.js.map
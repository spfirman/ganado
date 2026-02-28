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
exports.SimpleEventController = void 0;
const common_1 = require("@nestjs/common");
const simple_event_service_1 = require("../services/simple-event.service");
const create_simple_event_dto_1 = require("../dto/create-simple-event.dto");
const sync_simple_events_dto_1 = require("../dto/sync-simple-events.dto");
const swagger_1 = require("@nestjs/swagger");
const application_permissions_decorator_1 = require("../../../common/application-permissions/application-permissions.decorator");
const animal_simple_event_repository_1 = require("../repositories/animal-simple-event.repository");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const application_permissions_guard_1 = require("../../../common/application-permissions/application-permissions.guard");
const session_user_decorator_1 = require("../../../common/decorators/session-user.decorator");
const session_user_dto_1 = require("../../auth/dto/session-user.dto");
const simple_event_response_dto_1 = require("../dto/simple-event-response.dto");
const update_simple_events_dto_1 = require("../dto/update-simple-events.dto");
let SimpleEventController = class SimpleEventController {
    simpleEventService;
    simpleEventCattleRepository;
    constructor(simpleEventService, simpleEventCattleRepository) {
        this.simpleEventService = simpleEventService;
        this.simpleEventCattleRepository = simpleEventCattleRepository;
    }
    create(sessionUser, dto) {
        return this.simpleEventService.createSimpleEvent(sessionUser.tenant_id, dto);
    }
    async sync(sessionUser, dto) {
        const results = await this.simpleEventService.syncSimpleEvents(sessionUser.tenant_id, dto.simpleEvents);
        return { results };
    }
    list(sessionUser, idMassiveEvent) {
        return this.simpleEventService.findByMassiveEvent(sessionUser.tenant_id, idMassiveEvent);
    }
    findById(sessionUser, id) {
        return this.simpleEventService.findByIdOrFail(sessionUser.tenant_id, id);
    }
    async getAppliedCattleIdsBySimpleEvent(id) {
        const links = await this.simpleEventCattleRepository.findBySimpleEvent(id);
        return links.map(link => ({
            idCattle: link.idAnimal,
            appliedAt: link.appliedAt,
            appliedBy: link.appliedBy,
        }));
    }
    update(sessionUser, id, dto) {
        return this.simpleEventService.updateSimpleEvent(sessionUser.tenant_id, id, dto);
    }
};
exports.SimpleEventController = SimpleEventController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new simple event and attach to a massive event' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Simple event created successfully', type: simple_event_response_dto_1.SimpleEventResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Massive event not found' }),
    (0, application_permissions_decorator_1.RequireAction)('create'),
    (0, swagger_1.ApiBody)({
        type: create_simple_event_dto_1.CreateSimpleEventDto,
        examples: {
            weight: {
                summary: 'Weight type (data varies per cattle)',
                value: {
                    idMassiveEvent: 'uuid-massive-event',
                    type: 'weight',
                    data: {}
                }
            },
            eartag: {
                summary: 'Eartag type (can define left/right values)',
                value: {
                    idMassiveEvent: 'uuid-massive-event',
                    type: 'eartag',
                    data: { eartagLeft: 'ET-L-001', eartagRight: 'ET-R-001' }
                }
            },
            tracker: {
                summary: 'Tracker type (data varies per cattle)',
                value: {
                    idMassiveEvent: 'uuid-massive-event',
                    type: 'tracker',
                    data: {}
                }
            },
            castration: {
                summary: 'Castration type (data varies per cattle)',
                value: {
                    idMassiveEvent: 'uuid-massive-event',
                    type: 'castration',
                    data: {}
                }
            },
            brand: {
                summary: 'Brand type (same brand for all cattle)',
                value: {
                    idMassiveEvent: 'uuid-massive-event',
                    type: 'brand',
                    data: { brandId: 'uuid-brand', brandName: 'Brand Name' }
                }
            },
            medication: {
                summary: 'Medication type (same medication for all cattle)',
                value: {
                    idMassiveEvent: 'uuid-massive-event',
                    type: 'medication',
                    data: {
                        medicationName: 'abc',
                        dosage: '1ml/50kg',
                        route: 'oral',
                        lot: '232adf-asdf'
                    }
                }
            }
        }
    }),
    __param(0, (0, session_user_decorator_1.SessionUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_dto_1.SessionUserDto, create_simple_event_dto_1.CreateSimpleEventDto]),
    __metadata("design:returntype", void 0)
], SimpleEventController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('sync'),
    (0, swagger_1.ApiOperation)({ summary: 'Sync simple events (offline → backend)' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Simple events synced successfully',
        type: sync_simple_events_dto_1.SyncSimpleEventsResponseDto,
    }),
    (0, application_permissions_decorator_1.RequireAction)('create'),
    (0, swagger_1.ApiBody)({
        type: sync_simple_events_dto_1.SyncSimpleEventsRequestDto,
        examples: {
            example1: {
                summary: 'Syncing various simple events',
                value: {
                    simpleEvents: [
                        {
                            id: 'uuid-se-weight',
                            idMassiveEvent: 'uuid-massive',
                            type: 'weight',
                            dataJson: '{}',
                        },
                        {
                            id: 'uuid-se-eartag',
                            idMassiveEvent: 'uuid-massive',
                            type: 'eartag',
                            dataJson: '{"eartagLeft":"ET-L-001","eartagRight":"ET-R-001"}',
                        },
                        {
                            id: 'uuid-se-tracker',
                            idMassiveEvent: 'uuid-massive',
                            type: 'tracker',
                            dataJson: '{}',
                        },
                        {
                            id: 'uuid-se-brand',
                            idMassiveEvent: 'uuid-massive',
                            type: 'brand',
                            dataJson: '{"idBrand":"brand-777"}',
                        },
                        {
                            id: 'uuid-se-castration',
                            idMassiveEvent: 'uuid-massive',
                            type: 'castration',
                        },
                        {
                            id: 'uuid-se-medication',
                            idMassiveEvent: 'uuid-massive',
                            type: 'medication',
                            dataJson: '{"medicationName":"med-001","dosage":"1ml","route":"oral","lot":"LOT-2025"}',
                        },
                    ],
                },
            },
        },
    }),
    __param(0, (0, session_user_decorator_1.SessionUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_dto_1.SessionUserDto, sync_simple_events_dto_1.SyncSimpleEventsRequestDto]),
    __metadata("design:returntype", Promise)
], SimpleEventController.prototype, "sync", null);
__decorate([
    (0, common_1.Get)('by-massive-event/:idMassiveEvent'),
    (0, swagger_1.ApiOperation)({ summary: 'List all simple events by massive event' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of simple events by massive event' }),
    (0, application_permissions_decorator_1.RequireAction)('read'),
    __param(0, (0, session_user_decorator_1.SessionUser)()),
    __param(1, (0, common_1.Param)('idMassiveEvent')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_dto_1.SessionUserDto, String]),
    __metadata("design:returntype", void 0)
], SimpleEventController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a simple event by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Simple event found' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Simple event not found' }),
    (0, application_permissions_decorator_1.RequireAction)('read'),
    __param(0, (0, session_user_decorator_1.SessionUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_dto_1.SessionUserDto, String]),
    __metadata("design:returntype", void 0)
], SimpleEventController.prototype, "findById", null);
__decorate([
    (0, common_1.Get)('by-cattle/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'List all ids of cattle related to a simple event' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of cattle IDs' }),
    (0, application_permissions_decorator_1.RequireAction)('read'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SimpleEventController.prototype, "getAppliedCattleIdsBySimpleEvent", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a simple event' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Simple event updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Simple event not found' }),
    (0, application_permissions_decorator_1.RequireAction)('update'),
    __param(0, (0, session_user_decorator_1.SessionUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_dto_1.SessionUserDto, String, update_simple_events_dto_1.UpdateSimpleEventDto]),
    __metadata("design:returntype", void 0)
], SimpleEventController.prototype, "update", null);
exports.SimpleEventController = SimpleEventController = __decorate([
    (0, swagger_1.ApiTags)('Simple Events'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.Controller)('simple-events'),
    (0, application_permissions_decorator_1.RequireEntity)('simple_events'),
    (0, application_permissions_decorator_1.RequireModule)('MASSIVE_EVENTS'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, application_permissions_guard_1.ApplicationPermissionsGuard),
    __metadata("design:paramtypes", [simple_event_service_1.SimpleEventService,
        animal_simple_event_repository_1.AnimalSimpleEventRepository])
], SimpleEventController);
//# sourceMappingURL=simple-event.controller.js.map
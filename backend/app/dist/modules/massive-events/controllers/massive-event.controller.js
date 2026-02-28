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
exports.MassiveEventController = void 0;
const common_1 = require("@nestjs/common");
const massive_event_service_1 = require("../services/massive-event.service");
const create_massive_event_dto_1 = require("../dto/create-massive-event.dto");
const swagger_1 = require("@nestjs/swagger");
const application_permissions_decorator_1 = require("../../../common/application-permissions/application-permissions.decorator");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const application_permissions_guard_1 = require("../../../common/application-permissions/application-permissions.guard");
const session_user_decorator_1 = require("../../../common/decorators/session-user.decorator");
const session_user_dto_1 = require("../../auth/dto/session-user.dto");
const massive_event_response_dto_1 = require("../dto/massive-event-response.dto");
const sync_massive_event_dto_1 = require("../dto/sync-massive-event.dto");
let MassiveEventController = class MassiveEventController {
    massiveEventService;
    constructor(massiveEventService) {
        this.massiveEventService = massiveEventService;
    }
    async create(sessionUser, dto) {
        const massiveEvent = await this.massiveEventService.createMassiveEvent(sessionUser.tenant_id, sessionUser.sub, dto);
        return massive_event_response_dto_1.MassiveEventResponseDto.toResponseDto(massiveEvent, massiveEvent.simpleEvents);
    }
    async findOne(sessionUser, id) {
        const massiveEvent = await this.massiveEventService.findByIdOrFail(sessionUser.tenant_id, id);
        return massive_event_response_dto_1.MassiveEventResponseDto.toResponseDto(massiveEvent, massiveEvent.simpleEvents);
    }
    async getAppliedCattleIdsByMassiveEvent(idMassiveEvent, sessionUser) {
        return this.massiveEventService.findCattleByMassiveEvent(sessionUser.tenant_id, idMassiveEvent);
    }
    async list(sessionUser) {
        const massiveEvents = await this.massiveEventService.findAll(sessionUser.tenant_id);
        return massiveEvents.map(massiveEvent => massive_event_response_dto_1.MassiveEventResponseDto.toResponseDto(massiveEvent, massiveEvent.simpleEvents));
    }
    async close(sessionUser, id) {
        await this.massiveEventService.closeMassiveEvent(sessionUser.tenant_id, id);
    }
    sync(user, body) {
        return this.massiveEventService.syncMassiveEvents(user.tenant_id, body.massiveEvents);
    }
};
exports.MassiveEventController = MassiveEventController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new massive event with initial simple events' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Massive event created successfully', type: massive_event_response_dto_1.MassiveEventResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid request body' }),
    (0, application_permissions_decorator_1.RequireAction)('create'),
    (0, swagger_1.ApiBody)({
        type: create_massive_event_dto_1.CreateMassiveEventDto,
        examples: {
            medication: {
                summary: 'Massive event with medication simple event',
                value: {
                    eventDate: '2025-07-24',
                    simpleEvents: [
                        {
                            type: 'medication',
                            data: {
                                medicationName: 'abc',
                                dosage: '1ml/50kg',
                                route: 'oral',
                                lot: '232adf-asdf'
                            }
                        }
                    ]
                }
            }
        }
    }),
    __param(0, (0, session_user_decorator_1.SessionUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_dto_1.SessionUserDto, create_massive_event_dto_1.CreateMassiveEventDto]),
    __metadata("design:returntype", Promise)
], MassiveEventController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a massive event by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Massive event found', type: massive_event_response_dto_1.MassiveEventResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Massive event not found' }),
    (0, application_permissions_decorator_1.RequireAction)('read'),
    __param(0, (0, session_user_decorator_1.SessionUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_dto_1.SessionUserDto, String]),
    __metadata("design:returntype", Promise)
], MassiveEventController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('cattle/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'List all ids of cattle impacted by a massive event' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of cattle with metadata' }),
    (0, application_permissions_decorator_1.RequireAction)('read'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, session_user_dto_1.SessionUserDto]),
    __metadata("design:returntype", Promise)
], MassiveEventController.prototype, "getAppliedCattleIdsByMassiveEvent", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List all massive events' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of massive events', type: [massive_event_response_dto_1.MassiveEventResponseDto] }),
    (0, application_permissions_decorator_1.RequireAction)('read'),
    __param(0, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_dto_1.SessionUserDto]),
    __metadata("design:returntype", Promise)
], MassiveEventController.prototype, "list", null);
__decorate([
    (0, common_1.Put)('close/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Close a massive event' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Massive event closed' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Massive event not found' }),
    (0, swagger_1.ApiResponse)({ status: 422, description: 'No simple events applied' }),
    (0, application_permissions_decorator_1.RequireAction)('update'),
    __param(0, (0, session_user_decorator_1.SessionUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_dto_1.SessionUserDto, String]),
    __metadata("design:returntype", Promise)
], MassiveEventController.prototype, "close", null);
__decorate([
    (0, common_1.Post)('sync'),
    (0, swagger_1.ApiOperation)({ summary: 'Sync Massive Events and their Simple Events (offline to backend)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Massive Events synced successfully', type: sync_massive_event_dto_1.SyncMassiveEventsResponseDto }),
    (0, swagger_1.ApiBody)({
        type: sync_massive_event_dto_1.SyncMassiveEventsRequestDto,
        examples: {
            example1: {
                summary: 'MassiveEvent with all types of SimpleEvents',
                value: {
                    massiveEvents: [
                        {
                            id: 'uuid-massive-1',
                            idTenant: 'tenant-uuid',
                            eventDate: '2025-07-24T00:00:00Z',
                            status: 'open',
                            createdBy: 'user-123',
                            createdAt: '2025-07-24T00:00:00Z',
                            simpleEvents: [
                                {
                                    id: 'uuid-se-weight',
                                    type: 'weight',
                                    dataJson: '{}'
                                },
                                {
                                    id: 'uuid-se-eartag',
                                    type: 'eartag',
                                    dataJson: '{"eartagLeft":"ET-L-001","eartagRight":"ET-R-001"}'
                                },
                                {
                                    id: 'uuid-se-tracker',
                                    type: 'tracker',
                                    dataJson: '{}'
                                },
                                {
                                    id: 'uuid-se-brand',
                                    type: 'brand',
                                    dataJson: '{"idBrand":"brand-777"}'
                                },
                                {
                                    id: 'uuid-se-castration',
                                    type: 'castration'
                                },
                                {
                                    id: 'uuid-se-medication',
                                    type: 'medication',
                                    dataJson: '{"medicationName":"med-001","dosage":"1ml","route":"oral","lot":"LOT-2025"}'
                                }
                            ]
                        }
                    ]
                }
            }
        },
    }),
    (0, application_permissions_decorator_1.RequireAction)('create'),
    __param(0, (0, session_user_decorator_1.SessionUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_dto_1.SessionUserDto, sync_massive_event_dto_1.SyncMassiveEventsRequestDto]),
    __metadata("design:returntype", void 0)
], MassiveEventController.prototype, "sync", null);
exports.MassiveEventController = MassiveEventController = __decorate([
    (0, swagger_1.ApiTags)('Massive Events'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.Controller)('massive-events'),
    (0, application_permissions_decorator_1.RequireEntity)('massive_events'),
    (0, application_permissions_decorator_1.RequireModule)('MASSIVE_EVENTS'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, application_permissions_guard_1.ApplicationPermissionsGuard),
    __metadata("design:paramtypes", [massive_event_service_1.MassiveEventService])
], MassiveEventController);
//# sourceMappingURL=massive-event.controller.js.map
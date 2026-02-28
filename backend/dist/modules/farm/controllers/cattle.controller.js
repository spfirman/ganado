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
var CattleController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CattleController = void 0;
const common_1 = require("@nestjs/common");
const cattle_service_1 = require("../services/cattle.service");
const create_cattle_dto_1 = require("../dto/create-cattle.dto");
const update_cattle_dto_1 = require("../dto/update-cattle.dto");
const create_cattle_medication_history_dto_1 = require("../dto/create-cattle-medication-history.dto");
const swagger_1 = require("@nestjs/swagger");
const application_permissions_decorator_1 = require("../../../common/application-permissions/application-permissions.decorator");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const application_permissions_guard_1 = require("../../../common/application-permissions/application-permissions.guard");
const common_2 = require("@nestjs/common");
const cattle_response_dto_1 = require("../dto/cattle-response.dto");
const cattle_basic_response_dto_1 = require("../dto/cattle-basic-response.dto");
const cattle_basic_page_dto_1 = require("../dto/cattle-basic-page.dto");
const cattle_basic_query_dto_1 = require("../dto/cattle-basic-query.dto");
const cattle_list_query_dto_1 = require("../dto/cattle-list.query.dto");
const paged_response_dto_1 = require("../../../shared/dto/paged-response.dto");
const session_user_decorator_1 = require("../../../common/decorators/session-user.decorator");
const session_user_dto_1 = require("../../auth/dto/session-user.dto");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const apply_simple_events_dto_1 = require("../../massive-events/dto/apply-simple-events.dto");
const animal_simple_event_repository_1 = require("../../massive-events/repositories/animal-simple-event.repository");
const sync_animal_simple_event_dto_1 = require("../../massive-events/dto/sync-animal-simple-event.dto");
const animal_simple_event_entity_1 = require("../../massive-events/entities/animal-simple-event.entity");
const common_3 = require("@nestjs/common");
let CattleController = CattleController_1 = class CattleController {
    cattleService;
    simpleEventCattleRepository;
    logger = new common_3.Logger(CattleController_1.name);
    constructor(cattleService, simpleEventCattleRepository) {
        this.cattleService = cattleService;
        this.simpleEventCattleRepository = simpleEventCattleRepository;
    }
    create(sessionUser, dto) {
        return this.cattleService.create(sessionUser.tenant_id, dto, sessionUser.sub);
    }
    search(sessionUser, query) {
        return this.cattleService.search(sessionUser.tenant_id, query);
    }
    findOne(id, sessionUser) {
        return this.cattleService.findByIdOrFail(sessionUser.tenant_id, id);
    }
    update(id, sessionUser, dto) {
        return this.cattleService.update(sessionUser.tenant_id, id, dto, sessionUser.sub);
    }
    addMedication(id, sessionUser, dto) {
        return this.cattleService.addMedicationHistory(sessionUser.tenant_id, id, dto, sessionUser.sub);
    }
    remove(id, sessionUser) {
        this.cattleService.remove(sessionUser.tenant_id, id);
    }
    async list(sessionUser, query) {
        const { items, total, page, limit } = await this.cattleService.listPaged(sessionUser.tenant_id, query);
        return paged_response_dto_1.PagedResponseDto.of(page, limit, total, items);
    }
    getBasicInfo(sessionUser) {
        return this.cattleService.getBasicInfo(sessionUser.tenant_id);
    }
    getBasicInfoPaged(sessionUser, query) {
        return this.cattleService.getBasicInfoPaged(sessionUser.tenant_id, query);
    }
    async findSimpleEventsByCattle(id, sessionUser) {
        const links = await this.simpleEventCattleRepository.findByCattle(sessionUser.tenant_id, id);
        return links.map(link => ({
            idSimpleEvent: link.idSimpleEvent,
            appliedAt: link.appliedAt,
            appliedBy: link.appliedBy,
        }));
    }
    async applyEventsToSingleCattle(sessionUser, cattleNumber, applied) {
        const appliedEvents = await this.cattleService.applyMultipleSimpleEventsByNumber_transaction(sessionUser.tenant_id, sessionUser.sub, cattleNumber, applied.idMassiveEvent, applied.events);
        this.logger.debug(`log_cattle 1: Applied events: ${appliedEvents}`);
        return appliedEvents;
    }
    async applySimpleEventsToSeveralCattle(sessionUser, body) {
        return this.cattleService.applyBulkSimpleEvents(sessionUser.tenant_id, sessionUser.sub, body.events);
    }
    async syncSimpleEventCattle(sessionUser, body) {
        const results = await this.cattleService.syncCattleSimpleEvents(sessionUser.tenant_id, sessionUser.sub, body.animalSimpleEvent);
        return { results };
    }
    import(sessionUser, file) {
        return this.cattleService.import(file, sessionUser.tenant_id);
    }
    async validateCattleByNumber(number, user) {
        return this.cattleService.validateCattleByNumber(number, user.tenant_id);
    }
    async recordWeightHistory(id, dto, user) {
        return this.cattleService.recordWeightHistory(id, dto, user.tenant_id, user.sub);
    }
    async updateCattleWeight(id, dto, user) {
        return this.cattleService.updateCattleWeight(id, dto.weight, user.tenant_id);
    }
    async bulkUpdateStatus(dto, user) {
        return this.cattleService.bulkUpdateStatus(dto.cattleIds, dto.status, user.tenant_id);
    }
};
exports.CattleController = CattleController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new cattle' }),
    (0, application_permissions_decorator_1.RequireAction)('create'),
    (0, swagger_1.ApiBody)({
        type: create_cattle_dto_1.CreateCattleDto, required: true, examples: {
            example1: {
                summary: 'Mandatory fields',
                value: {
                    sysNumber: '1234567890',
                    number: '1234567890',
                    receivedAt: '2021-01-01',
                    color: 'colors_enum',
                    receivedWeight: 100,
                    purchasePrice: 100,
                    purchaseWeight: 100
                },
            },
            example2: {
                summary: 'Create a new cattle with all fields',
                value: {
                    deveui: 'string',
                    sysNumber: 'string',
                    number: 'string',
                    brand: 'uuid-brand',
                    color: 'colors_enum',
                    characteristics: ['string'],
                    receivedAt: 'string',
                    receivedWeight: 0,
                    purchaseWeight: 0,
                    comments: 'string',
                    purchasedFrom: 'string',
                    purchasePrice: 0,
                    purchaseCommission: 0,
                    negotiatedPricePerKg: 0,
                    lotPricePerWeight: 0,
                },
            },
        }
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Cattle created successfully', type: cattle_response_dto_1.CattleResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid request body' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Device {deveui} not found' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Cattle number already exists' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Unexpected error during creation process' }),
    __param(0, (0, session_user_decorator_1.SessionUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_dto_1.SessionUserDto, create_cattle_dto_1.CreateCattleDto]),
    __metadata("design:returntype", void 0)
], CattleController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('search'),
    (0, swagger_1.ApiOperation)({ summary: 'Search cattle by number, eartags, or device' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of matching cattle', type: [cattle_response_dto_1.CattleResponseDto] }),
    (0, application_permissions_decorator_1.RequireAction)('read'),
    __param(0, (0, session_user_decorator_1.SessionUser)()),
    __param(1, (0, common_1.Query)('q')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_dto_1.SessionUserDto, String]),
    __metadata("design:returntype", void 0)
], CattleController.prototype, "search", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a cattle by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Cattle found', type: cattle_response_dto_1.CattleResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Cattle not found' }),
    (0, application_permissions_decorator_1.RequireAction)('read'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, session_user_dto_1.SessionUserDto]),
    __metadata("design:returntype", void 0)
], CattleController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a cattle' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Cattle updated' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Cattle not found' }),
    (0, application_permissions_decorator_1.RequireAction)('update'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, session_user_decorator_1.SessionUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, session_user_dto_1.SessionUserDto, update_cattle_dto_1.UpdateCattleDto]),
    __metadata("design:returntype", void 0)
], CattleController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/medication'),
    (0, swagger_1.ApiOperation)({ summary: 'Add medication history to a cattle' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Medication history added' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Cattle not found' }),
    (0, application_permissions_decorator_1.RequireAction)('update'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, session_user_decorator_1.SessionUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, session_user_dto_1.SessionUserDto, create_cattle_medication_history_dto_1.CreateCattleMedicationHistoryDto]),
    __metadata("design:returntype", void 0)
], CattleController.prototype, "addMedication", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a cattle' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Cattle deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Cattle not found' }),
    (0, application_permissions_decorator_1.RequireAction)('delete'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, session_user_dto_1.SessionUserDto]),
    __metadata("design:returntype", void 0)
], CattleController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List all cattle' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of cattle', type: paged_response_dto_1.PagedResponseDto }),
    (0, application_permissions_decorator_1.RequireAction)('read'),
    __param(0, (0, session_user_decorator_1.SessionUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_dto_1.SessionUserDto, cattle_list_query_dto_1.CattleListQueryDto]),
    __metadata("design:returntype", Promise)
], CattleController.prototype, "list", null);
__decorate([
    (0, common_1.Get)('basic-info'),
    (0, swagger_1.ApiOperation)({ summary: 'Get basic info of all cattle' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Basic info of all cattle', type: [cattle_basic_response_dto_1.CattleBasicResponseDto] }),
    (0, application_permissions_decorator_1.RequireAction)('read'),
    __param(0, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_dto_1.SessionUserDto]),
    __metadata("design:returntype", void 0)
], CattleController.prototype, "getBasicInfo", null);
__decorate([
    (0, common_1.Get)('basic'),
    (0, swagger_1.ApiOperation)({ summary: 'Get basic cattle info (paged with cursor & optional delta)' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: cattle_basic_page_dto_1.CattleBasicPageDto }),
    (0, application_permissions_decorator_1.RequireAction)('read'),
    __param(0, (0, session_user_decorator_1.SessionUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_dto_1.SessionUserDto,
        cattle_basic_query_dto_1.CattleBasicQueryDto]),
    __metadata("design:returntype", void 0)
], CattleController.prototype, "getBasicInfoPaged", null);
__decorate([
    (0, common_1.Get)('simple-events/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'List all simple events applied to a cattle' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of simple events IDs' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Cattle not found' }),
    (0, application_permissions_decorator_1.RequireAction)('read'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, session_user_dto_1.SessionUserDto]),
    __metadata("design:returntype", Promise)
], CattleController.prototype, "findSimpleEventsByCattle", null);
__decorate([
    (0, common_1.Post)('apply-events/:cattleNumber'),
    (0, swagger_1.ApiOperation)({ summary: 'Apply multiple simple events to a single cattle by number' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Events applied successfully', type: [animal_simple_event_entity_1.AnimalSimpleEvent] }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Cattle {cattleNumber} not found / Device {deveui} not found' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Unexpected error during application process' }),
    (0, application_permissions_decorator_1.RequireAction)('update'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                idMassiveEvent: { type: 'string' },
                events: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            type: { type: 'string', enum: ['weight', 'eartag', 'tracker', 'brand', 'castration', 'medication'] },
                            data: { type: 'object' },
                            appliedBy: { type: 'string' },
                            idSimpleEvent: { type: 'string' }
                        }
                    }
                }
            }
        },
        examples: {
            example1: {
                summary: 'Apply multiple events to only one cattle',
                value: {
                    applied: {
                        idMassiveEvent: 'uuid-massive-event-1',
                        events: [
                            { type: 'weight', data: { weight: 350.58 }, idSimpleEvent: 'uuid-simple-event-1' },
                            { type: 'eartag', data: { eartagLeft: 'ET-789', eartagRight: 'ET-790' }, idSimpleEvent: 'uuid-simple-event-2' },
                            { type: 'tracker', data: { tracker_deveui: 'a173ecf6ffe3abcd' }, idSimpleEvent: 'uuid-simple-event-3' },
                            { type: 'castration', data: {}, idSimpleEvent: 'uuid-simple-event-4' },
                            { type: 'medication', data: { medicationName: "Antrimizin NF 85 mg", dosage: "1.2 mg/kg", route: "oral", lot: "LOT-2025" }, idSimpleEvent: 'uuid-simple-event-5' },
                            { type: 'medication', data: { medicationName: "Boldenona 50 mg", dosage: "1 mL/90 Kg", route: "Intramuscular profunda", lot: "LOT-2025" }, idSimpleEvent: 'uuid-simple-event-6' },
                            { type: 'brand', data: { idBrand: "abc123" }, idSimpleEvent: 'uuid-simple-event-7' }
                        ]
                    }
                }
            }
        }
    }),
    __param(0, (0, session_user_decorator_1.SessionUser)()),
    __param(1, (0, common_1.Param)('cattleNumber')),
    __param(2, (0, common_1.Body)('applied')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_dto_1.SessionUserDto, String, Object]),
    __metadata("design:returntype", Promise)
], CattleController.prototype, "applyEventsToSingleCattle", null);
__decorate([
    (0, common_1.Post)('apply-simple-events'),
    (0, swagger_1.ApiOperation)({ summary: 'Apply multiple simple events to multiple cattle by their number' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Events applied successfully', type: [cattle_response_dto_1.CattleResponseDto] }),
    (0, application_permissions_decorator_1.RequireAction)('update'),
    (0, swagger_1.ApiBody)({
        type: apply_simple_events_dto_1.ApplySimpleEventsDto,
        examples: {
            example1: {
                summary: 'Apply various events',
                value: {
                    events: [
                        {
                            cattleNumber: 'C-001',
                            type: 'weight',
                            data: { weight: 350 },
                            idMassiveEvent: 'uuid-massive-event-1',
                            idSimpleEvent: 'uuid-simple-event-1'
                        },
                        {
                            cattleNumber: 'C-002',
                            type: 'eartag',
                            data: { eartagLeft: 'ET-789' },
                            idMassiveEvent: 'uuid-massive-event-1',
                            idSimpleEvent: 'uuid-simple-event-2'
                        },
                        {
                            cattleNumber: 'C-003',
                            type: 'eartag',
                            data: { eartagRight: 'ET-790' },
                            idMassiveEvent: 'uuid-massive-event-2',
                            idSimpleEvent: 'uuid-simple-event-3'
                        }
                    ]
                }
            }
        }
    }),
    __param(0, (0, session_user_decorator_1.SessionUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_dto_1.SessionUserDto,
        apply_simple_events_dto_1.ApplySimpleEventsDto]),
    __metadata("design:returntype", Promise)
], CattleController.prototype, "applySimpleEventsToSeveralCattle", null);
__decorate([
    (0, common_1.Post)('sync-cattle-simple-event'),
    (0, swagger_1.ApiOperation)({ summary: 'Sync offline cattle-simple-event records to backend' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Sync results', type: sync_animal_simple_event_dto_1.SyncAnimalSimpleEventResponseDto }),
    (0, application_permissions_decorator_1.RequireAction)('update'),
    (0, swagger_1.ApiBody)({
        type: sync_animal_simple_event_dto_1.SyncAnimalSimpleEventRequestDto,
        examples: {
            example1: {
                summary: 'Sync multiple SimpleEventCattle',
                value: {
                    simpleEventCattle: [
                        {
                            id: 'uuid-local-1',
                            idTenant: 'tenant-uuid',
                            cattleNumber: 'C-123',
                            type: 'weight',
                            dataJson: '{"weight":350}',
                            appliedAt: '2025-07-24T10:00:00Z',
                            appliedBy: 'user-123',
                            idMassiveEvent: 'uuid-massive-event-1',
                            idSimpleEvent: 'uuid-simple-event-1'
                        },
                        {
                            id: 'uuid-local-2',
                            idTenant: 'tenant-uuid',
                            cattleNumber: 'C-999',
                            type: 'medication',
                            dataJson: '{"medicationName":"med-001","dosage":"1ml","route":"oral","lot":"LOT-2025"}',
                            appliedAt: '2025-07-24T11:00:00Z',
                            appliedBy: 'user-123',
                            idMassiveEvent: 'uuid-massive-event-1',
                            idSimpleEvent: 'uuid-simple-event-2'
                        }
                    ]
                }
            }
        }
    }),
    __param(0, (0, session_user_decorator_1.SessionUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_dto_1.SessionUserDto,
        sync_animal_simple_event_dto_1.SyncAnimalSimpleEventRequestDto]),
    __metadata("design:returntype", Promise)
], CattleController.prototype, "syncSimpleEventCattle", null);
__decorate([
    (0, common_1.Post)('import'),
    (0, swagger_1.ApiOperation)({ summary: 'Import cattle from an Excel file' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({ schema: { type: 'object', required: ['file'], properties: { file: { type: 'string', format: 'binary' } } } }),
    (0, application_permissions_decorator_1.RequireAction)('create'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads',
            filename: (req, file, cb) => {
                const randomName = Date.now() + '-' + Math.round(Math.random() * 1e9);
                cb(null, `${randomName}${(0, path_1.extname)(file.originalname)}`);
            },
        }),
        fileFilter: (req, file, cb) => {
            if (!file.originalname.match(/\.(xlsx|xls)$/)) {
                return cb(new Error('Only Excel files (.xlsx, .xls) are allowed'), false);
            }
            cb(null, true);
        },
    })),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Cattle imported successfully',
        schema: {
            example: {
                importedCount: 25,
                skippedCount: 2,
                errors: [],
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid file type. Only Excel files are allowed.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 422,
        description: 'File processed but contains invalid cattle records.',
        schema: {
            example: {
                importedCount: 20,
                skippedCount: 5,
                errors: [
                    { row: 3, error: 'Missing cattle ID' },
                    { row: 7, error: 'Invalid weight format' },
                ],
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Unexpected error during import process' }),
    __param(0, (0, session_user_decorator_1.SessionUser)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_dto_1.SessionUserDto, Object]),
    __metadata("design:returntype", void 0)
], CattleController.prototype, "import", null);
__decorate([
    (0, common_1.Get)('validate-number/:number'),
    (0, application_permissions_decorator_1.RequireAction)('read'),
    (0, swagger_1.ApiOperation)({ summary: 'Validate cattle by number for sale (checks ACTIVE status)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Cattle is valid and ACTIVE', type: cattle_response_dto_1.CattleResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Cattle not found or not ACTIVE' }),
    __param(0, (0, common_1.Param)('number')),
    __param(1, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, session_user_dto_1.SessionUserDto]),
    __metadata("design:returntype", Promise)
], CattleController.prototype, "validateCattleByNumber", null);
__decorate([
    (0, common_1.Post)(':id/weight-history'),
    (0, application_permissions_decorator_1.RequireAction)('update'),
    (0, swagger_1.ApiOperation)({ summary: 'Record weight measurement in history' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Weight recorded successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, session_user_dto_1.SessionUserDto]),
    __metadata("design:returntype", Promise)
], CattleController.prototype, "recordWeightHistory", null);
__decorate([
    (0, common_1.Put)(':id/weight'),
    (0, application_permissions_decorator_1.RequireAction)('update'),
    (0, swagger_1.ApiOperation)({ summary: 'Update cattle current weight' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Weight updated successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, session_user_dto_1.SessionUserDto]),
    __metadata("design:returntype", Promise)
], CattleController.prototype, "updateCattleWeight", null);
__decorate([
    (0, common_1.Put)('bulk-status'),
    (0, application_permissions_decorator_1.RequireAction)('update'),
    (0, swagger_1.ApiOperation)({ summary: 'Bulk update cattle status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Cattle statuses updated successfully' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, session_user_dto_1.SessionUserDto]),
    __metadata("design:returntype", Promise)
], CattleController.prototype, "bulkUpdateStatus", null);
exports.CattleController = CattleController = CattleController_1 = __decorate([
    (0, swagger_1.ApiTags)('Cattle'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.Controller)('cattle'),
    (0, application_permissions_decorator_1.RequireEntity)('cattle'),
    (0, application_permissions_decorator_1.RequireModule)('FARM'),
    (0, common_2.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, application_permissions_guard_1.ApplicationPermissionsGuard),
    __metadata("design:paramtypes", [cattle_service_1.CattleService,
        animal_simple_event_repository_1.AnimalSimpleEventRepository])
], CattleController);
//# sourceMappingURL=cattle.controller.js.map
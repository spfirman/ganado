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
exports.ReceptionsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const purchase_reception_repository_1 = require("../repositories/purchase-reception.repository");
const reception_response_dto_1 = require("../dto/reception-response.dto");
const simple_event_type_enum_1 = require("../../massive-events/enums/simple-event-type.enum");
const common_2 = require("@nestjs/common");
const uuid_1 = require("uuid");
const massive_event_repository_1 = require("../../massive-events/repositories/massive-event.repository");
const lot_repository_1 = require("../../commerce/repositories/lot.repository");
const cattle_repository_1 = require("../../farm/repositories/cattle.repository");
const animal_simple_event_repository_1 = require("../../massive-events/repositories/animal-simple-event.repository");
const simple_event_repository_1 = require("../../massive-events/repositories/simple-event.repository");
const purchase_repository_1 = require("../../commerce/repositories/purchase.repository");
const cattle_entity_1 = require("../../farm/entities/cattle.entity");
const provider_repository_1 = require("../../commerce/repositories/provider.repository");
const cattle_service_1 = require("../../farm/services/cattle.service");
const configurations_service_1 = require("../../configurations/services/configurations.service");
const cattle_weight_history_entity_1 = require("../../farm/entities/cattle-weight-history.entity");
const cattle_weight_history_repository_1 = require("../../farm/repositories/cattle-weight-history.repository");
const receive_cattle_response_dto_1 = require("../dto/receive-cattle-response.dto");
const cattle_characteristic_repository_1 = require("../../farm/repositories/cattle-characteristic.repository");
const color_characteristics_service_1 = require("../../farm/services/color-characteristics.service");
const lot_service_1 = require("../../commerce/services/lot.service");
const device_entity_1 = require("../../production-center/entities/device.entity");
const typeorm_2 = require("typeorm");
const typeorm_3 = require("@nestjs/typeorm");
const devices_service_1 = require("../../production-center/services/devices.service");
const cattle_device_history_repository_1 = require("../../farm/repositories/cattle-device-history.repository");
let ReceptionsService = class ReceptionsService {
    ds;
    prRepo;
    purchaseRepo;
    massiveEventRepo;
    lotRepo;
    cattleService;
    cattleRepo;
    animalSimpleEventRepo;
    simpleEventRepo;
    providerRepo;
    configurationsService;
    cattleWeightHistoryRepo;
    cattleCharacteristicRepository;
    cattleDeviceHistoryRepository;
    deviceService;
    colorCharacteristicsService;
    lotService;
    deviceRepo;
    constructor(ds, prRepo, purchaseRepo, massiveEventRepo, lotRepo, cattleService, cattleRepo, animalSimpleEventRepo, simpleEventRepo, providerRepo, configurationsService, cattleWeightHistoryRepo, cattleCharacteristicRepository, cattleDeviceHistoryRepository, deviceService, colorCharacteristicsService, lotService, deviceRepo) {
        this.ds = ds;
        this.prRepo = prRepo;
        this.purchaseRepo = purchaseRepo;
        this.massiveEventRepo = massiveEventRepo;
        this.lotRepo = lotRepo;
        this.cattleService = cattleService;
        this.cattleRepo = cattleRepo;
        this.animalSimpleEventRepo = animalSimpleEventRepo;
        this.simpleEventRepo = simpleEventRepo;
        this.providerRepo = providerRepo;
        this.configurationsService = configurationsService;
        this.cattleWeightHistoryRepo = cattleWeightHistoryRepo;
        this.cattleCharacteristicRepository = cattleCharacteristicRepository;
        this.cattleDeviceHistoryRepository = cattleDeviceHistoryRepository;
        this.deviceService = deviceService;
        this.colorCharacteristicsService = colorCharacteristicsService;
        this.lotService = lotService;
        this.deviceRepo = deviceRepo;
    }
    async searchDevices(idTenant, query) {
        return this.deviceRepo.find({
            take: 20,
            where: [
                { idTenant, name: (0, typeorm_2.ILike)(`%${query}%`) },
                { idTenant, deveui: (0, typeorm_2.ILike)(`%${query}%`) }
            ]
        });
    }
    async getSimpleReception(idTenant, idPurchase, manager) {
        return await this.prRepo.findByPurchase(idTenant, idPurchase, manager);
    }
    async findOrCreateReceptionByIdPurchase(idTenant, idPurchase, userId) {
        var reception = this.ds.transaction(async (manager) => {
            var purchase = await this.purchaseRepo.findById(idPurchase, idTenant, manager);
            if (!purchase) {
                throw new common_2.NotFoundException('Purchase not found');
            }
            var reception = await this.prRepo.findByPurchase(idTenant, idPurchase, manager);
            var massiveEvent;
            if (!reception) {
                var dataMassiveEvent = {
                    id: (0, uuid_1.v4)(),
                    idTenant,
                    eventDate: new Date(),
                    status: 'open',
                    createdBy: userId,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    simpleEvents: [],
                    name: 'Reception ' + purchase.id,
                };
                massiveEvent = await this.massiveEventRepo.saveWithManager(manager, dataMassiveEvent);
                massiveEvent.simpleEvents = [];
                reception = await this.prRepo.createInstance({ idTenant, idPurchase, idMassiveEvent: massiveEvent.id }, manager);
            }
            else {
                massiveEvent = await this.massiveEventRepo.findById(idTenant, reception.idMassiveEvent, manager);
                if (massiveEvent) {
                    massiveEvent.simpleEvents = await this.simpleEventRepo.findByMassiveEvent(idTenant, massiveEvent.id, manager);
                }
            }
            var provider = await this.providerRepo.findById(purchase.idProvider, idTenant, manager);
            var lots = await this.lotRepo.findByPurchaseId(idPurchase, idTenant, manager);
            var lotCattle = {};
            var appliedEvents = {};
            for (const l of lots) {
                var lc = await this.cattleRepo.findByIdLot(idTenant, l.id, manager);
                for (const c of lc) {
                    var animalSimpleEvents = await this.animalSimpleEventRepo.findByCattle(idTenant, c.id, manager);
                    appliedEvents[c.id] = animalSimpleEvents;
                }
                lotCattle[l.id] = lc;
            }
            var cattle = await this.cattleRepo.findByIdPurchaseWithoutLot(idTenant, idPurchase, manager);
            for (const c of cattle) {
                var animalSimpleEvents = await this.animalSimpleEventRepo.findByCattle(idTenant, c.id, manager);
                appliedEvents[c.id] = animalSimpleEvents;
            }
            return reception_response_dto_1.PurchaseReceptionResponseDto.toResponseDto(reception, purchase, provider.name, lots, lotCattle, cattle, appliedEvents, massiveEvent);
        });
        return reception;
    }
    async receiveCattle_Transaction(idTenant, idCurrentUser, cattleDto) {
        return this.ds.transaction(async (manager) => {
            let cattle = await this.cattleRepo.findByNumberAndTenantId(idTenant, cattleDto.number, manager);
            if (cattle && (cattle.status === cattle_entity_1.CattleStatus.ACTIVE || cattle.status === cattle_entity_1.CattleStatus.LOST)) {
                throw new common_2.ConflictException('Cattle with number ' + cattleDto.number + ' already exists');
            }
            var nextCattleSysnumber = await this.configurationsService.getTenantConfiguration(idTenant, 'next_cattle_sysnumber', manager);
            var nextCattleSysnumberValue = parseInt(nextCattleSysnumber.value);
            await this.configurationsService.updateTenantConfiguration(idTenant, 'next_cattle_sysnumber', (nextCattleSysnumberValue + 1).toString(), manager);
            if (cattleDto.eartagLeft) {
                const existingCattleWithEartag = await this.cattleRepo.findByAnyEartag(idTenant, cattleDto.eartagLeft, manager);
                if (existingCattleWithEartag) {
                    throw new common_2.ConflictException(`Eartag ${cattleDto.eartagLeft} already exists for another cattle`);
                }
            }
            if (cattleDto.eartagRight) {
                const existingCattleWithEartag = await this.cattleRepo.findByAnyEartag(idTenant, cattleDto.eartagRight, manager);
                if (existingCattleWithEartag) {
                    throw new common_2.ConflictException(`Eartag ${cattleDto.eartagRight} already exists for another cattle`);
                }
            }
            if (cattleDto.idDevice) {
                await this.cattleDeviceHistoryRepository.unassignDeviceByidDevice(idTenant, cattleDto.idDevice, manager, new Date());
                await this.cattleRepo.unsetDevice(idTenant, cattleDto.idDevice, manager);
            }
            if (cattleDto.idLot) {
                let lot = await this.lotRepo.findById(idTenant, cattleDto.idLot, manager);
                if (!lot) {
                    throw new common_2.NotFoundException('Lot not found ' + cattleDto.idLot);
                }
                if (!cattleDto.purchaseWeight) {
                    cattleDto.purchaseWeight = lot.averageWeight;
                }
                if (!cattleDto.purchasePrice) {
                    cattleDto.purchasePrice = lot.averageWeight * lot.pricePerKg;
                }
            }
            var cattleData = {
                id: (0, uuid_1.v4)(),
                idTenant,
                sysNumber: nextCattleSysnumberValue,
                number: cattleDto.number,
                receivedAt: new Date(),
                receivedWeight: cattleDto.receivedWeight,
                purchaseWeight: cattleDto.purchaseWeight,
                purchasePrice: cattleDto.purchasePrice,
                idLot: cattleDto.idLot ?? null,
                idBrand: cattleDto.idBrand ?? null,
                color: cattleDto.color,
                eartagLeft: cattleDto.eartagLeft ?? null,
                eartagRight: cattleDto.eartagRight ?? null,
                idDevice: cattleDto.idDevice ?? null,
                castrated: cattleDto.castrated,
                comments: cattleDto.comments ?? null,
                createdAt: new Date(),
                updatedAt: new Date(),
                lastWeight: cattleDto.receivedWeight,
                status: cattle_entity_1.CattleStatus.ACTIVE,
                idProvider: cattleDto.idProvider ?? null,
                idPurchase: cattleDto.idPurchase,
                gender: cattleDto.gender,
                birthDateAprx: cattleDto.birthDateAprx ? new Date(cattleDto.birthDateAprx) : null,
                hasHorn: cattleDto.hasHorn
            };
            cattle = await this.cattleRepo.saveWithManager(manager, cattleData);
            var weightHistory = {
                id: (0, uuid_1.v4)(),
                idTenant,
                idCattle: cattle.id,
                weight: cattleDto.receivedWeight,
                date: new Date(),
                context: cattle_weight_history_entity_1.WeightContext.RECEIVED,
                recordedBy: idCurrentUser,
            };
            await this.cattleWeightHistoryRepo.createWithManager(manager, weightHistory);
            var characteristics = cattleDto.characteristics ?? [];
            if (characteristics.length > 0) {
                await this.cattleCharacteristicRepository.attachMany(cattle.id, idTenant, characteristics, manager);
            }
            if (cattleDto.idLot) {
                await this.lotService.UpdateLotDataAfterReception(idTenant, cattleDto.idLot, manager);
            }
            var reception = null;
            if (cattleDto.idPurchase) {
                reception = await this.getSimpleReception(idTenant, cattleDto.idPurchase, manager);
                if (reception != null) {
                    var nextnumber = await this.cattleRepo.getSuggestNextNumber(idTenant, cattleDto.number, manager);
                    reception.nextCattleNumber = nextnumber;
                    await manager.save(reception);
                }
            }
            if (cattleDto.idDevice) {
                const device = await this.deviceService.findById(cattleDto.idDevice, idTenant, manager);
                if (device) {
                    const tags = device.tags ?? {};
                    tags.idCattle = cattle.id;
                    tags.idDevice = device.id;
                    tags.idTenant = idTenant;
                    const deviceUpdateDto = {
                        tags: tags
                    };
                    await this.deviceService.updateWithDevice(device, deviceUpdateDto, manager);
                    await this.cattleDeviceHistoryRepository.assignDeviceToCattle(device.id, cattle.id, idTenant, idCurrentUser, new Date(), undefined, manager);
                    cattle.device = device;
                }
                else {
                    throw new common_2.NotFoundException(`Device ${cattleDto.idDevice} not found`);
                }
            }
            var simpleEventIds = cattleDto.idSimpleEvents ?? [];
            var appliedEvents = [];
            if (simpleEventIds.length > 0) {
                var simpleEvents = await this.simpleEventRepo.findByIds(idTenant, simpleEventIds, manager);
                if (simpleEvents && simpleEvents.length > 0) {
                    var simpEvents = [];
                    var idMassiveEvent;
                    for (const simpleEvent of simpleEvents) {
                        idMassiveEvent = simpleEvent.idMassiveEvent;
                        if (simpleEvent.type !== simple_event_type_enum_1.SimpleEventType.WEIGHT) {
                            simpEvents.push({
                                type: simpleEvent.type,
                                data: simpleEvent.data,
                                appliedBy: idCurrentUser,
                                appliedAt: new Date(),
                                idSimpleEvent: simpleEvent.id,
                            });
                        }
                    }
                    appliedEvents = await this.cattleService.applyMultipleSimpleEventsByNumber_manager(idTenant, idCurrentUser, cattle.number, idMassiveEvent, simpEvents, manager, cattle);
                }
            }
            return receive_cattle_response_dto_1.ReceiveCattleResponseDto.toResponseDto(cattle, appliedEvents);
        });
    }
    async assignLotCattle(idTenant, dto) {
        return this.ds.transaction(async (manager) => {
            let cattle = await this.cattleRepo.findById(idTenant, dto.idCattle, manager);
            if (!cattle) {
                throw new common_2.NotFoundException('Cattle not found');
            }
            var oldLot = null;
            if (cattle.idLot) {
                oldLot = await this.lotRepo.findById(idTenant, cattle.idLot, manager);
            }
            let lot = await this.lotRepo.findById(idTenant, dto.idLot, manager);
            if (!lot) {
                throw new common_2.NotFoundException('Lot not found');
            }
            cattle.idLot = dto.idLot;
            cattle.purchaseWeight = lot.averageWeight ?? 0;
            cattle.purchasePrice = (lot.averageWeight ?? 0) * (lot.pricePerKg ?? 0);
            cattle = await this.cattleRepo.saveWithManager(manager, cattle);
            await this.lotService.UpdateLotDataAfterReception(idTenant, dto.idLot, manager);
            if (oldLot) {
                await this.lotService.UpdateLotDataAfterReception(idTenant, oldLot.id, manager);
            }
            return cattle;
        });
    }
    async nextNumber(idTenant, number) {
        return this.ds.transaction(async (manager) => {
            return await this.cattleRepo.getSuggestNextNumber(idTenant, number, manager);
        });
    }
};
exports.ReceptionsService = ReceptionsService;
exports.ReceptionsService = ReceptionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(17, (0, typeorm_3.InjectRepository)(device_entity_1.Device)),
    __metadata("design:paramtypes", [typeorm_1.DataSource,
        purchase_reception_repository_1.PurchaseReceptionRepository,
        purchase_repository_1.PurchaseRepository,
        massive_event_repository_1.MassiveEventRepository,
        lot_repository_1.LotRepository,
        cattle_service_1.CattleService,
        cattle_repository_1.CattleRepository,
        animal_simple_event_repository_1.AnimalSimpleEventRepository,
        simple_event_repository_1.SimpleEventRepository,
        provider_repository_1.ProviderRepository,
        configurations_service_1.ConfigurationsService,
        cattle_weight_history_repository_1.CattleWeightHistoryRepository,
        cattle_characteristic_repository_1.CattleCharacteristicRepository,
        cattle_device_history_repository_1.CattleDeviceHistoryRepository,
        devices_service_1.DevicesService,
        color_characteristics_service_1.ColorCharacteristicsService,
        lot_service_1.LotService,
        typeorm_2.Repository])
], ReceptionsService);
//# sourceMappingURL=receptions.service.js.map
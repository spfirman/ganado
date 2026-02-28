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
var SalesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const sale_entity_1 = require("../entities/sale.entity");
const sale_detail_entity_1 = require("../entities/sale-detail.entity");
const cattle_entity_1 = require("../../farm/entities/cattle.entity");
const cattle_device_history_repository_1 = require("../../farm/repositories/cattle-device-history.repository");
const devices_service_1 = require("../../production-center/services/devices.service");
const cattle_repository_1 = require("../../farm/repositories/cattle.repository");
let SalesService = SalesService_1 = class SalesService {
    dataSource;
    deviceService;
    cattleDeviceHistoryRepository;
    cattleRepository;
    logger = new common_1.Logger(SalesService_1.name);
    constructor(dataSource, deviceService, cattleDeviceHistoryRepository, cattleRepository) {
        this.dataSource = dataSource;
        this.deviceService = deviceService;
        this.cattleDeviceHistoryRepository = cattleDeviceHistoryRepository;
        this.cattleRepository = cattleRepository;
    }
    async createSale(dto) {
        return await this.dataSource.transaction(async (manager) => {
            const sale = manager.create(sale_entity_1.Sale, {
                transactionDate: dto.transactionDate,
                buyerId: dto.buyerId,
                transporterId: dto.transporterId,
                minWeightConfig: dto.minWeightConfig,
                valuePerKgConfig: dto.valuePerKgConfig,
                totalAnimalCount: dto.totalAnimalCount,
                totalWeightKg: dto.totalWeightKg,
                totalAmount: dto.totalAmount,
                notes: dto.notes,
                idTenant: dto.idTenant,
                createdBy: dto.createdBy,
                updatedAt: new Date(),
            });
            const savedSale = await manager.save(sale_entity_1.Sale, sale);
            for (const detailDto of dto.details) {
                const detail = manager.create(sale_detail_entity_1.SaleDetail, {
                    saleId: savedSale.id,
                    cattleId: detailDto.cattleId,
                    measuredWeight: detailDto.measuredWeight,
                    isApproved: detailDto.isApproved,
                    rejectionReason: detailDto.rejectionReason,
                    trackerRemoved: detailDto.trackerRemoved ?? false,
                    calculatedPrice: detailDto.calculatedPrice,
                    idTenant: dto.idTenant,
                });
                await manager.save(sale_detail_entity_1.SaleDetail, detail);
                if (detailDto.isApproved) {
                    await manager.update(cattle_entity_1.Cattle, { id: detailDto.cattleId, idTenant: dto.idTenant }, {
                        status: cattle_entity_1.CattleStatus.SOLD,
                        saleWeight: detailDto.measuredWeight,
                        salePrice: detailDto.calculatedPrice,
                        salePricePerKg: dto.valuePerKgConfig,
                        idProvider: dto.buyerId,
                    });
                }
                if (detailDto.trackerRemoved) {
                    const cattleInTx = await manager.findOne(cattle_entity_1.Cattle, { where: { id: detailDto.cattleId, idTenant: dto.idTenant } });
                    if (cattleInTx && cattleInTx.idDevice) {
                        const deviceId = cattleInTx.idDevice;
                        const device = await this.deviceService.findById(deviceId, dto.idTenant, manager);
                        await this.cattleDeviceHistoryRepository.unassignDeviceByidCattle(dto.idTenant, cattleInTx.id, manager, dto.transactionDate);
                        await manager.update(cattle_entity_1.Cattle, { id: cattleInTx.id }, { idDevice: null });
                        if (device) {
                            const tags = device.tags || {};
                            delete tags.idCattle;
                            delete tags.id_cattle;
                            const deviceUpdateDto = {
                                name: device.name,
                                tags: tags
                            };
                            await this.deviceService.updateWithDevice(device, deviceUpdateDto, manager);
                        }
                    }
                }
            }
            return savedSale;
        });
    }
    async findAll(idTenant, query) {
        const { skip, take, orderBy, order, startDate, endDate, buyerId } = query;
        const queryBuilder = this.dataSource.getRepository(sale_entity_1.Sale).createQueryBuilder('sale')
            .leftJoinAndSelect('sale.buyer', 'buyer')
            .leftJoinAndSelect('sale.transporter', 'transporter')
            .leftJoinAndSelect('sale.details', 'details')
            .leftJoin('details.cattle', 'cattle')
            .addSelect(['cattle.id', 'cattle.number', 'cattle.salePrice', 'cattle.saleWeight'])
            .where('sale.idTenant = :idTenant', { idTenant });
        if (buyerId) {
            queryBuilder.andWhere('sale.buyerId = :buyerId', { buyerId });
        }
        if (startDate) {
            const start = new Date(startDate);
            const end = endDate ? new Date(endDate) : new Date('2999-12-31');
            queryBuilder.andWhere('sale.transactionDate BETWEEN :start AND :end', { start, end });
        }
        const validSortFields = ['transactionDate', 'totalAmount', 'totalWeightKg', 'createdAt', 'updatedAt'];
        const sortField = (orderBy && validSortFields.includes(orderBy)) ? `sale.${orderBy}` : 'sale.transactionDate';
        const sortOrder = order === 'ASC' ? 'ASC' : 'DESC';
        queryBuilder.orderBy(sortField, sortOrder);
        queryBuilder.skip(skip).take(take);
        const [items, total] = await queryBuilder.getManyAndCount();
        return { items, total };
    }
    async findAll2(idTenant, query) {
        const { skip, take, orderBy, order, startDate, endDate, buyerId, status } = query;
        const where = { idTenant };
        if (buyerId) {
            where.buyerId = buyerId;
        }
        if (startDate && endDate) {
            where.transactionDate = (0, typeorm_1.Between)(new Date(startDate), new Date(endDate));
        }
        else if (startDate) {
            where.transactionDate = (0, typeorm_1.Between)(new Date(startDate), new Date('2999-12-31'));
        }
        const [items, total] = await this.dataSource.getRepository(sale_entity_1.Sale).findAndCount({
            where,
            relations: ['buyer', 'transporter', 'details', 'details.cattle'],
            order: { [orderBy]: order },
            skip,
            take,
        });
        return { items, total };
    }
    async findOne(idTenant, id) {
        const sale = await this.dataSource.getRepository(sale_entity_1.Sale).findOne({
            where: { id, idTenant },
            relations: ['buyer', 'transporter', 'details', 'details.cattle'],
        });
        if (!sale)
            throw new common_1.NotFoundException(`Sale with ID ${id} not found`);
        return sale;
    }
    async update(idTenant, id, dto) {
        const sale = await this.findOne(idTenant, id);
        const { details, ...updateData } = dto;
        await this.dataSource.getRepository(sale_entity_1.Sale).update({ id, idTenant }, {
            ...updateData,
            updatedAt: new Date(),
        });
    }
};
exports.SalesService = SalesService;
exports.SalesService = SalesService = SalesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource,
        devices_service_1.DevicesService,
        cattle_device_history_repository_1.CattleDeviceHistoryRepository,
        cattle_repository_1.CattleRepository])
], SalesService);
//# sourceMappingURL=sales.service.js.map
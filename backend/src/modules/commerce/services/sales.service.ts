import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { DataSource, Between } from 'typeorm';
import { Sale } from '../entities/sale.entity';
import { SaleDetail } from '../entities/sale-detail.entity';
import { Cattle, CattleStatus } from '../../farm/entities/cattle.entity';
import { CattleDeviceHistoryRepository } from '../../farm/repositories/cattle-device-history.repository';
import { DevicesService } from '../../production-center/services/devices.service';
import { CattleRepository } from '../../farm/repositories/cattle.repository';
import { CreateSaleDto } from '../dto/create-sale.dto';
import { GetSalesQueryDto } from '../dto/get-sales-query.dto';
import { UpdateSaleDto } from '../dto/update-sale.dto';

@Injectable()
export class SalesService {
  private readonly logger = new Logger(SalesService.name);

  constructor(
    private readonly dataSource: DataSource,
    private readonly deviceService: DevicesService,
    private readonly cattleDeviceHistoryRepository: CattleDeviceHistoryRepository,
    private readonly cattleRepository: CattleRepository,
  ) {}

  async createSale(dto: CreateSaleDto): Promise<Sale> {
    return await this.dataSource.transaction(async (manager) => {
      const sale = manager.create(Sale, {
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
      const savedSale = await manager.save(Sale, sale);

      for (const detailDto of dto.details) {
        const detail = manager.create(SaleDetail, {
          saleId: savedSale.id,
          cattleId: detailDto.cattleId,
          measuredWeight: detailDto.measuredWeight,
          isApproved: detailDto.isApproved,
          rejectionReason: detailDto.rejectionReason,
          trackerRemoved: detailDto.trackerRemoved ?? false,
          calculatedPrice: detailDto.calculatedPrice,
          idTenant: dto.idTenant,
        });
        await manager.save(SaleDetail, detail);

        if (detailDto.isApproved) {
          await manager.update(
            Cattle,
            { id: detailDto.cattleId, idTenant: dto.idTenant },
            {
              status: CattleStatus.SOLD,
              saleWeight: detailDto.measuredWeight,
              salePrice: detailDto.calculatedPrice,
              salePricePerKg: dto.valuePerKgConfig,
              idProvider: dto.buyerId,
            },
          );
        }

        if (detailDto.trackerRemoved) {
          const cattleInTx = await manager.findOne(Cattle, {
            where: { id: detailDto.cattleId, idTenant: dto.idTenant },
          });
          if (cattleInTx && cattleInTx.idDevice) {
            const deviceId = cattleInTx.idDevice;
            const device = await this.deviceService.findById(deviceId, dto.idTenant, manager);
            await this.cattleDeviceHistoryRepository.unassignDeviceByidCattle(
              dto.idTenant,
              cattleInTx.id,
              manager,
              dto.transactionDate,
            );
            await manager.update(Cattle, { id: cattleInTx.id }, { idDevice: null });

            if (device) {
              const tags = device.tags || {};
              delete tags.idCattle;
              delete tags.id_cattle;
              const deviceUpdateDto = {
                name: device.name,
                tags: tags,
              };
              await this.deviceService.updateWithDevice(device, deviceUpdateDto, manager);
            }
          }
        }
      }

      return savedSale;
    });
  }

  async findAll(
    idTenant: string,
    query: GetSalesQueryDto,
  ): Promise<{ items: Sale[]; total: number }> {
    let { skip, take, orderBy, order, startDate, endDate, buyerId } = query;

    if (query.page && !skip) skip = (query.page - 1) * (query.limit || take || 10);
    if (query.limit && !take) take = query.limit;

    const queryBuilder = this.dataSource
      .getRepository(Sale)
      .createQueryBuilder('sale')
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

    const validSortFields = [
      'transactionDate',
      'totalAmount',
      'totalWeightKg',
      'createdAt',
      'updatedAt',
    ];
    const sortField =
      orderBy && validSortFields.includes(orderBy) ? `sale.${orderBy}` : 'sale.transactionDate';
    const sortOrder = order === 'ASC' ? 'ASC' : 'DESC';
    queryBuilder.orderBy(sortField, sortOrder);

    queryBuilder.skip(skip).take(take);

    const [items, total] = await queryBuilder.getManyAndCount();
    return { items, total };
  }

  async findAll2(
    idTenant: string,
    query: GetSalesQueryDto,
  ): Promise<{ items: Sale[]; total: number }> {
    const { skip, take, orderBy, order, startDate, endDate, buyerId, status } = query;
    const where: any = { idTenant };

    if (buyerId) {
      where.buyerId = buyerId;
    }

    if (startDate && endDate) {
      where.transactionDate = Between(new Date(startDate), new Date(endDate));
    } else if (startDate) {
      where.transactionDate = Between(new Date(startDate), new Date('2999-12-31'));
    }

    const [items, total] = await this.dataSource.getRepository(Sale).findAndCount({
      where,
      relations: ['buyer', 'transporter', 'details', 'details.cattle'],
      order: { [orderBy]: order },
      skip,
      take,
    });

    return { items, total };
  }

  async findOne(idTenant: string, id: string): Promise<Sale> {
    const sale = await this.dataSource.getRepository(Sale).findOne({
      where: { id, idTenant },
      relations: ['buyer', 'transporter', 'details', 'details.cattle'],
    });
    if (!sale) throw new NotFoundException(`Sale with ID ${id} not found`);
    return sale;
  }

  async update(idTenant: string, id: string, dto: UpdateSaleDto): Promise<void> {
    const sale = await this.findOne(idTenant, id);
    const { details, ...updateData } = dto;
    await this.dataSource.getRepository(Sale).update(
      { id, idTenant },
      {
        ...updateData,
        updatedAt: new Date(),
      },
    );
  }
}

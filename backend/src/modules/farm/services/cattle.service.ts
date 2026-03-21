import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { Cattle, CattleStatus } from '../entities/cattle.entity';
import { CreateCattleDto } from '../dto/create-cattle.dto';
import { CattleRepository } from '../repositories/cattle.repository';
import { CattleDeviceHistoryRepository } from '../repositories/cattle-device-history.repository';
import { CattleWeightHistoryRepository } from '../repositories/cattle-weight-history.repository';
import { CattleEartagHistoryRepository } from '../repositories/cattle-eartag-history.repository';
import { CattleMedicationHistoryRepository } from '../repositories/cattle-medication-history.repository';
import { MassiveEventService } from '../../massive-events/services/massive-event.service';
import { SimpleEventService } from '../../massive-events/services/simple-event.service';
import { AnimalSimpleEventRepository } from '../../massive-events/repositories/animal-simple-event.repository';
import { DevicesService } from '../../production-center/services/devices.service';
import * as ExcelJS from 'exceljs';
import * as fs from 'fs';
import { SimpleEventType } from '../../massive-events/enums/simple-event-type.enum';
import { CattleCharacteristicRepository } from '../repositories/cattle-characteristic.repository';
import { CattleCharacteristic } from '../entities/cattle-characteristic.entity';
import { CattleWeightHistory, WeightContext } from '../entities/cattle-weight-history.entity';
import { CattleMedicationHistory } from '../entities/cattle-medication-history.entity';
import { ConfigurationsService } from '../../configurations/services/configurations.service';
import { CattleListQueryDto } from '../dto/cattle-list.query.dto';
import { CattleBasicQueryDto } from '../dto/cattle-basic-query.dto';

@Injectable()
export class CattleService {
  private readonly logger = new Logger(CattleService.name);

  constructor(
    private readonly cattleRepository: CattleRepository,
    private readonly cattleDeviceHistoryRepository: CattleDeviceHistoryRepository,
    private readonly cattleWeightHistoryRepository: CattleWeightHistoryRepository,
    private readonly cattleEartagHistoryRepository: CattleEartagHistoryRepository,
    private readonly cattleMedicationHistoryRepository: CattleMedicationHistoryRepository,
    private readonly cattleCharacteristicRepository: CattleCharacteristicRepository,
    private readonly deviceService: DevicesService,
    private readonly animalSimpleEventRepository: AnimalSimpleEventRepository,
    private readonly dataSource: DataSource,
    private readonly massiveEventService: MassiveEventService,
    private readonly simpleEventService: SimpleEventService,
    private readonly configurationsService: ConfigurationsService,
  ) {}

  async applyBulkSimpleEvents(
    idTenant: string,
    idCurrentUser: string,
    events: any[],
  ): Promise<Cattle[]> {
    return this.dataSource.transaction(async (manager) => {
      var minimumMassiveEvents: Record<string, any[]> = {};
      const results: Cattle[] = [];
      for (const ev of events) {
        const cattle = await this.cattleRepository.findOneForUpdateByNumber(
          idTenant,
          ev.cattleNumber,
          manager,
        );
        if (!cattle) {
          continue;
        }
        this.validateStatusForApplyEvents(cattle.status);
        const massiveEvent =
          await this.massiveEventService.findWithSimpleEventsByIdOrFail(
            idTenant,
            ev.idMassiveEvent,
            manager,
          );
        if (massiveEvent.status === 'closed')
          throw new HttpException(
            'Massive event already closed',
            HttpStatus.UNPROCESSABLE_ENTITY,
          );
        if (!minimumMassiveEvents[ev.idMassiveEvent])
          minimumMassiveEvents[ev.idMassiveEvent] = [];
        minimumMassiveEvents[ev.idMassiveEvent].push({
          idSimEv: ev.idSimpleEvent,
          type: ev.type,
        });
        await this.applySingleEventToCattle(
          manager,
          idTenant,
          idCurrentUser,
          cattle,
          ev,
        );
        if (ev.idMassiveEvent) {
          await this.animalSimpleEventRepository.saveWithManager(manager, {
            id: crypto.randomUUID(),
            idTenant,
            idSimpleEvent: ev.idSimpleEvent,
            idMassiveEvent: ev.idMassiveEvent,
            idAnimal: cattle.id,
            appliedAt: new Date(),
            appliedBy: ev.appliedBy ?? idCurrentUser,
          } as any);
        }
        await this.cattleRepository.saveWithManager(manager, cattle);
        results.push(cattle);
      }
      return results;
    });
  }

  async applyMultipleSimpleEventsByNumber_transaction(
    idTenant: string,
    idCurrentUser: string,
    cattleNumber: string,
    idMassiveEvent: string,
    events: any[],
    manager?: EntityManager,
  ): Promise<any[]> {
    if (manager) {
      return this.applyMultipleSimpleEventsByNumber_manager(
        idTenant,
        idCurrentUser,
        cattleNumber,
        idMassiveEvent,
        events,
        manager,
      );
    } else {
      return this.dataSource.transaction(async (manager) => {
        return this.applyMultipleSimpleEventsByNumber_manager(
          idTenant,
          idCurrentUser,
          cattleNumber,
          idMassiveEvent,
          events,
          manager,
        );
      });
    }
  }

  async applyMultipleSimpleEventsByNumber_manager(
    idTenant: string,
    idCurrentUser: string,
    cattleNumber: string,
    idMassiveEvent: string,
    events: any[],
    manager: EntityManager,
    cattle?: Cattle,
  ): Promise<any[]> {
    const massiveEvent =
      await this.massiveEventService.findWithSimpleEventsByIdOrFail(
        idTenant,
        idMassiveEvent,
        manager,
      );
    if (massiveEvent.status === 'closed')
      throw new HttpException(
        'Massive event already closed',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    const cattleEntity =
      cattle ??
      (await this.cattleRepository.findOneForUpdateByNumber(
        idTenant,
        cattleNumber,
        manager,
      ));
    if (!cattleEntity)
      throw new NotFoundException(`Cattle ${cattleNumber} not found`);
    this.validateStatusForApplyEvents(cattleEntity.status);
    const createdEvents: any[] = [];
    for (const ev of events) {
      if (
        ev.type === SimpleEventType.CASTRATION &&
        cattleEntity.castrated
      ) {
        continue;
      }
      await this.simpleEventService.findByIdOrFail(
        idTenant,
        ev.idSimpleEvent,
        manager,
      );
      await this.applySingleEventToCattle(manager, idTenant, idCurrentUser, cattleEntity, {
        ...ev,
        idMassiveEvent: idMassiveEvent,
        appliedBy: ev.appliedBy ?? idCurrentUser,
      });
      const event = await this.animalSimpleEventRepository.saveWithManager(
        manager,
        {
          id: crypto.randomUUID(),
          idTenant,
          idSimpleEvent: ev.idSimpleEvent,
          idMassiveEvent: idMassiveEvent,
          idAnimal: cattleEntity.id,
          provisionalNumber: cattleNumber,
          appliedAt: ev.appliedAt ?? new Date(),
          appliedBy: ev.appliedBy ?? idCurrentUser,
          data: ev.data,
        },
      );
      const responsedto = {
        ...event,
        idAnimal: cattleEntity.id,
        type: ev.type,
        animalNumber: cattleNumber,
        data: ev.data,
      };
      createdEvents.push(responsedto);
    }
    await this.cattleRepository.saveWithManager(manager, cattleEntity);
    return createdEvents;
  }

  async applySingleEventToCattle(
    manager: EntityManager,
    idTenant: string,
    idCurrentUser: string,
    cattle: Cattle,
    ev: any,
  ): Promise<void> {
    this.validateStatusForApplyEvents(cattle.status);
    switch (ev.type) {
      case SimpleEventType.WEIGHT: {
        const newWeight = ev.data.weight;
        const newDate = ev.appliedAt ?? new Date();
        const previousRecord =
          await this.cattleWeightHistoryRepository.findLastByCattle(
            idTenant,
            cattle.id,
            manager,
          );
        let averageDailyGain: number | null = null;
        if (previousRecord != null && previousRecord.weight != null) {
          averageDailyGain = this.computeAverageDailyGain(
            Number(previousRecord.weight),
            previousRecord.date,
            newWeight,
            newDate,
          );
        }
        cattle.lastWeight = newWeight;
        cattle.updatedAt = new Date();
        if (averageDailyGain != null) {
          cattle.averageDailyGain = averageDailyGain;
        }
        await this.cattleWeightHistoryRepository.createWithManager(manager, {
          idTenant: idTenant,
          idCattle: cattle.id,
          weight: newWeight,
          date: newDate,
          idMassiveEvent: ev.idMassiveEvent,
          context: WeightContext.EVENT,
          recordedBy: ev.appliedBy ?? idCurrentUser,
        });
        break;
      }
      case SimpleEventType.EARTAG:
        const nextEartagLeft = ev.data.eartagLeft ?? null;
        const nextEartagRight = ev.data.eartagRight ?? null;
        if (nextEartagLeft) {
          const cattleWithSameEartagLeft =
            await this.cattleRepository.findByAnyEartag(
              idTenant,
              nextEartagLeft,
              manager,
            );
          if (
            cattleWithSameEartagLeft &&
            cattleWithSameEartagLeft.id !== cattle.id
          ) {
            throw new ConflictException(
              `Eartag ${nextEartagLeft} already exists for another cattle`,
            );
          }
          cattle.eartagLeft = nextEartagLeft;
          await this.cattleEartagHistoryRepository.createWithManager(manager, {
            idTenant: idTenant,
            idCattle: cattle.id,
            data: { eartagLeft: nextEartagLeft },
            assignedAt: ev.appliedAt ?? new Date(),
            assignedBy: ev.appliedBy ?? idCurrentUser,
            idMassiveEvent: ev.idMassiveEvent,
          });
        }
        if (nextEartagRight) {
          const cattleWithSameEartagRight =
            await this.cattleRepository.findByAnyEartag(
              idTenant,
              nextEartagRight,
              manager,
            );
          if (
            cattleWithSameEartagRight &&
            cattleWithSameEartagRight.id !== cattle.id
          ) {
            throw new ConflictException(
              `Eartag ${nextEartagRight} already exists for another cattle`,
            );
          }
          cattle.eartagRight = nextEartagRight;
          await this.cattleEartagHistoryRepository.createWithManager(manager, {
            idTenant: idTenant,
            idCattle: cattle.id,
            data: { eartagRight: nextEartagRight },
            assignedAt: ev.appliedAt ?? new Date(),
            assignedBy: ev.appliedBy ?? idCurrentUser,
            idMassiveEvent: ev.idMassiveEvent,
          });
        }
        if (!nextEartagLeft && !nextEartagRight) {
          break;
        }
        cattle.updatedAt = new Date();
        break;
      case SimpleEventType.TRACKER:
        let device: any;
        if (ev.data.tracker_id) {
          device = await this.deviceService.findById(
            ev.data.tracker_id,
            idTenant,
            manager,
          );
        } else {
          device = await this.deviceService.findOne(
            ev.data.tracker_deveui,
            idTenant,
            manager,
          );
        }
        if (device) {
          if (cattle.idDevice !== device.id) {
            await this.cattleDeviceHistoryRepository.unassignDeviceByidCattle(
              idTenant,
              cattle.id,
              manager,
              ev.appliedAt ?? new Date(),
            );
            await this.cattleDeviceHistoryRepository.unassignDeviceByidDevice(
              idTenant,
              device.id,
              manager,
              ev.appliedAt ?? new Date(),
            );
            await this.cattleRepository.unsetDevice(
              idTenant,
              device.id,
              manager,
            );
            const tags = device.tags ?? {};
            tags.idCattle = cattle.id;
            tags.idDevice = device.id;
            tags.idTenant = idTenant;
            const deviceUpdateDto = {
              tags: tags,
            };
            await this.deviceService.updateWithDevice(
              device,
              deviceUpdateDto,
              manager,
            );
            cattle.idDevice = device.id;
            cattle.updatedAt = new Date();
            await this.cattleDeviceHistoryRepository.assignDeviceToCattle(
              device.id,
              cattle.id,
              idTenant,
              ev.appliedBy ?? idCurrentUser,
              ev.appliedAt ?? new Date(),
              ev.idMassiveEvent,
              manager,
            );
          }
        } else {
          throw new NotFoundException(
            `Device ${ev.data.tracker_deveui ?? ev.data.tracker_id} not found`,
          );
        }
        break;
      case SimpleEventType.BRAND:
        cattle.idBrand = ev.data.idBrand;
        cattle.updatedAt = new Date();
        break;
      case SimpleEventType.CASTRATION:
        if (!cattle.castrated) {
          cattle.castrated = true;
          cattle.castrationDate = ev.appliedAt ?? new Date();
          cattle.updatedAt = new Date();
        }
        break;
      case SimpleEventType.MEDICATION:
        await this.cattleMedicationHistoryRepository.createWithManager(
          manager,
          {
            idTenant: idTenant,
            idCattle: cattle.id,
            medicationName: ev.data.medicationName,
            dosage: ev.data.dosage,
            route: ev.data.route,
            lot: ev.data.lot,
            appliedAt: ev.appliedAt ?? new Date(),
            appliedBy: ev.appliedBy ?? idCurrentUser,
            idMassiveEvent: ev.idMassiveEvent,
          } as any,
        );
        break;
    }
    await manager.save(Cattle, cattle);
  }

  async syncCattleSimpleEvents(
    idTenant: string,
    idCurrentUser: string,
    events: any[],
  ): Promise<any[]> {
    return this.dataSource.transaction(async (manager) => {
      const results: any[] = [];
      for (const payload of events) {
        const cattle = await this.cattleRepository.findOneForUpdateByNumber(
          idTenant,
          payload.cattleNumber,
          manager,
        );
        if (!cattle) {
          results.push({
            id: payload.id,
            status: 'failed',
            message: `Cattle ${payload.cattleNumber} not found`,
          });
          continue;
        }
        try {
          this.validateStatusForApplyEvents(cattle.status);
        } catch (error) {
          results.push({
            id: payload.id,
            status: 'failed',
            message: `Cattle ${payload.cattleNumber} status is not valid for apply events`,
          });
          continue;
        }
        await this.applySingleEventToCattle(
          manager,
          idTenant,
          idCurrentUser,
          cattle,
          {
            type: payload.type,
            data: payload.dataJson ? JSON.parse(payload.dataJson) : {},
            appliedBy: payload.appliedBy ?? idCurrentUser,
            appliedAt: new Date(payload.appliedAt),
            idMassiveEvent: payload.idMassiveEvent,
            idSimpleEvent: payload.idSimpleEvent,
          },
        );
        await this.animalSimpleEventRepository.saveWithManager(manager, {
          id: payload.id,
          idTenant,
          idSimpleEvent: payload.idSimpleEvent,
          idMassiveEvent: payload.idMassiveEvent,
          idAnimal: cattle.id,
          appliedAt: new Date(payload.appliedAt),
          appliedBy: payload.appliedBy ?? idCurrentUser,
          data: payload.dataJson ? JSON.parse(payload.dataJson) : {},
          provisionalNumber: payload.cattleNumber,
        });
        await this.cattleRepository.saveWithManager(manager, cattle);
        results.push({
          id: payload.id,
          status: 'synced',
          animalServerId: cattle.id,
        });
      }
      return results;
    });
  }

  async create(
    idTenant: string,
    data: CreateCattleDto,
    idCurrentUser: string,
  ): Promise<Cattle> {
    return this.dataSource.transaction(async (trxManager) => {
      (data as any).idTenant = idTenant;
      var device: any = null;
      if (data.idDevice) {
        await this.cattleDeviceHistoryRepository.unassignDeviceByidDevice(
          idTenant,
          data.idDevice,
          trxManager,
          new Date(),
        );
        await this.cattleRepository.unsetDevice(
          idTenant,
          data.idDevice,
          trxManager,
        );
        device = await this.deviceService.findById(
          data.idDevice,
          idTenant,
          trxManager,
        );
        if (!device) {
          throw new NotFoundException(`Device ${data.idDevice} not found`);
        }
      }
      if (data.birthDateAprx) {
        (data as any).birthDateAprx = new Date(data.birthDateAprx);
      }
      if (data.newFeedStartDate) {
        (data as any).newFeedStartDate = new Date(data.newFeedStartDate);
      }
      const cattle = await this.cattleRepository.create(data as any, trxManager);
      if (data.characteristics) {
        await this.updateCharacteristics(
          cattle.id,
          data.characteristics,
          idTenant,
          trxManager,
        );
      }
      if (device) {
        const tags = device.tags ?? {};
        tags.idCattle = cattle.id;
        tags.idDevice = device.id;
        tags.idTenant = idTenant;
        const deviceUpdateDto = {
          tags: tags,
        };
        device = await this.deviceService.updateWithDevice(
          device,
          deviceUpdateDto,
          trxManager,
        );
        await this.cattleDeviceHistoryRepository.assignDeviceToCattle(
          device.id,
          cattle.id,
          idTenant,
          idCurrentUser,
          new Date(),
          undefined,
          trxManager,
        );
        cattle.device = device;
      }
      if (data.lastWeight) {
        const cwh = new CattleWeightHistory();
        cwh.idTenant = idTenant;
        cwh.idCattle = cattle.id;
        cwh.weight = data.lastWeight;
        cwh.date = new Date();
        cwh.context = WeightContext.MANUAL;
        await this.cattleWeightHistoryRepository.create(cwh, trxManager);
      }
      return cattle;
    });
  }

  async findByIdOrFail(
    idTenant: string,
    id: string,
    manager?: EntityManager,
  ): Promise<Cattle> {
    const cattle = await this.cattleRepository.findOne(idTenant, id, manager);
    if (!cattle) throw new NotFoundException(`Cattle ${id} not found`);
    return cattle;
  }

  async findByNumberOrFail(
    idTenant: string,
    number: string,
    manager?: EntityManager,
  ): Promise<Cattle> {
    const cattle = await this.cattleRepository.findByNumberAndTenantId(
      idTenant,
      number,
      manager,
    );
    if (!cattle) throw new NotFoundException(`Cattle ${number} not found`);
    return cattle;
  }

  async update(
    idTenant: string,
    id: string,
    data: any,
    idCurrentUser: string,
  ): Promise<any> {
    this.logger.log(data);
    return this.dataSource.transaction(async (trxManager) => {
      const oldCattle = await this.findByIdOrFail(idTenant, id, trxManager);
      if (
        !(
          (data.status == CattleStatus.ACTIVE &&
            oldCattle.status == CattleStatus.LOST) ||
          (data.status == CattleStatus.DEAD &&
            oldCattle.status == CattleStatus.LOST) ||
          (data.status == CattleStatus.ACTIVE &&
            oldCattle.status == CattleStatus.DEAD)
        )
      ) {
        this.validateStatusForApplyEvents(oldCattle.status);
      }
      const { characteristics, ...updateD } = data;
      const updateData: any = { updatedAt: new Date(), ...updateD };
      if (updateData.birthDateAprx != null) {
        updateData.birthDateAprx = new Date(updateData.birthDateAprx);
      }
      if (updateData.newFeedStartDate != null) {
        updateData.newFeedStartDate = new Date(updateData.newFeedStartDate);
      }
      this.logger.log(updateData);
      if (characteristics) {
        await this.updateCharacteristics(
          id,
          characteristics,
          idTenant,
          trxManager,
        );
      }
      if (updateData.idDevice) {
        await this.cattleDeviceHistoryRepository.unassignDeviceByidDevice(
          idTenant,
          updateData.idDevice,
          trxManager,
          new Date(),
        );
        await this.cattleRepository.unsetDevice(
          idTenant,
          updateData.idDevice,
          trxManager,
        );
        const device = await this.deviceService.findById(
          updateData.idDevice,
          idTenant,
          trxManager,
        );
        if (device) {
          const tags = device.tags ?? {};
          tags.idCattle = id;
          tags.idDevice = device.id;
          tags.idTenant = idTenant;
          const deviceUpdateDto = {
            tags: tags,
          };
          await this.deviceService.updateWithDevice(
            device,
            deviceUpdateDto,
            trxManager,
          );
          await this.cattleDeviceHistoryRepository.assignDeviceToCattle(
            device.id,
            id,
            idTenant,
            idCurrentUser,
            new Date(),
            undefined,
            trxManager,
          );
        } else {
          throw new NotFoundException(
            `Device ${updateData.idDevice} not found`,
          );
        }
      }
      if (updateData.number) {
        let cattle = await this.cattleRepository.findByNumberAndTenantId(
          idTenant,
          updateData.number,
          trxManager,
        );
        if (
          cattle &&
          (cattle.status === CattleStatus.ACTIVE ||
            cattle.status === CattleStatus.LOST) &&
          cattle.id != id
        ) {
          throw new ConflictException(
            'Cattle with number ' + updateData.number + ' already exists',
          );
        }
      }
      if (updateData.eartagLeft) {
        const cattle = await this.cattleRepository.findByAnyEartag(
          idTenant,
          updateData.eartagLeft,
          trxManager,
        );
        if (
          cattle &&
          (cattle.status === CattleStatus.ACTIVE ||
            cattle.status === CattleStatus.LOST) &&
          cattle.id != id
        ) {
          throw new ConflictException(
            `Eartag ${updateData.eartagLeft} already exists for another cattle`,
          );
        }
      }
      if (updateData.eartagRight) {
        const cattle = await this.cattleRepository.findByAnyEartag(
          idTenant,
          updateData.eartagRight,
          trxManager,
        );
        if (
          cattle &&
          (cattle.status === CattleStatus.ACTIVE ||
            cattle.status === CattleStatus.LOST) &&
          cattle.id != id
        ) {
          throw new ConflictException(
            `Eartag ${updateData.eartagRight} already exists for another cattle`,
          );
        }
      }
      if (updateData.lastWeight) {
        const newWeight = updateData.lastWeight;
        const newDate = new Date();
        const previousRecord =
          await this.cattleWeightHistoryRepository.findLastByCattle(
            idTenant,
            id,
            trxManager,
          );
        if (updateData.averageDailyGain == null) {
          let averageDailyGain: number | null = null;
          if (previousRecord != null && previousRecord.weight != null) {
            averageDailyGain = this.computeAverageDailyGain(
              Number(previousRecord.weight),
              previousRecord.date,
              newWeight,
              newDate,
            );
          }
          updateData.updatedAt = new Date();
          if (averageDailyGain != null) {
            updateData.averageDailyGain = averageDailyGain;
          }
        }
        const cwh = new CattleWeightHistory();
        cwh.idTenant = idTenant;
        cwh.idCattle = id;
        cwh.weight = updateData.lastWeight;
        cwh.date = newDate;
        cwh.context = WeightContext.MANUAL;
        await this.cattleWeightHistoryRepository.create(cwh, trxManager);
      }
      await this.cattleRepository.update(idTenant, id, updateData, trxManager);
      if (updateData.receivedWeight) {
        var cwhs = await this.cattleWeightHistoryRepository.findByCattle(
          idTenant,
          id,
          trxManager,
          WeightContext.RECEIVED,
        );
        if (cwhs.length > 0) {
          cwhs[0].weight = updateData.receivedWeight;
          await this.cattleWeightHistoryRepository.update(cwhs[0], trxManager);
        } else {
          const cwh = new CattleWeightHistory();
          cwh.idTenant = idTenant;
          cwh.idCattle = id;
          cwh.weight = updateData.receivedWeight;
          cwh.date = new Date();
          cwh.context = WeightContext.RECEIVED;
          await this.cattleWeightHistoryRepository.create(cwh, trxManager);
        }
      }
      if (updateData.saleWeight) {
        var cwhs = await this.cattleWeightHistoryRepository.findByCattle(
          idTenant,
          id,
          trxManager,
          WeightContext.SALE,
        );
        if (cwhs.length > 0) {
          cwhs[0].weight = updateData.saleWeight;
          await this.cattleWeightHistoryRepository.update(cwhs[0], trxManager);
        } else {
          const cwh = new CattleWeightHistory();
          cwh.idTenant = idTenant;
          cwh.idCattle = id;
          cwh.weight = updateData.saleWeight;
          cwh.date = new Date();
          cwh.context = WeightContext.SALE;
          await this.cattleWeightHistoryRepository.create(cwh, trxManager);
        }
      }
      const updatedCattle = await this.findByIdOrFail(
        idTenant,
        id,
        trxManager,
      );
      const [weightHistory, medicationHistory] = await Promise.all([
        this.cattleWeightHistoryRepository.findByCattle(
          idTenant,
          id,
          trxManager,
        ),
        this.cattleMedicationHistoryRepository.findByCattle(
          idTenant,
          id,
          trxManager,
        ),
      ]);
      const tenantGainConfig =
        await this.configurationsService.getTenantConfiguration(
          idTenant,
          'average_daily_gain',
        );
      const tenantGainKg = tenantGainConfig
        ? parseFloat(tenantGainConfig.value)
        : 0;
      const lastWeight =
        updatedCattle.lastWeight != null
          ? Number(updatedCattle.lastWeight)
          : null;
      const lastEntry =
        weightHistory.length > 0
          ? weightHistory[weightHistory.length - 1]
          : null;
      const lastWeightDate = lastEntry ? new Date(lastEntry.date) : null;
      const gainPerDayKg =
        updatedCattle.averageDailyGain != null
          ? Number(updatedCattle.averageDailyGain)
          : tenantGainKg;
      const daysSince = lastWeightDate
        ? (Date.now() - lastWeightDate.getTime()) / (1000 * 60 * 60 * 24)
        : 0;
      const estimatedWeight =
        lastWeight != null
          ? Math.round((lastWeight + gainPerDayKg * daysSince) * 100) / 100
          : null;
      return {
        ...updatedCattle,
        weightHistory,
        medicationHistory,
        estimatedWeight,
      };
    });
  }

  async updateCharacteristics(
    idCattle: string,
    characteristics: string[],
    idTenant: string,
    manager?: EntityManager,
  ): Promise<void> {
    if (manager) {
      await this.updateCharacteristicsWithManager(
        idCattle,
        characteristics,
        idTenant,
        manager,
      );
      return;
    }
    return this.dataSource.transaction(async (trxManager) => {
      await this.updateCharacteristicsWithManager(
        idCattle,
        characteristics,
        idTenant,
        trxManager,
      );
    });
  }

  computeAverageDailyGain(
    previousWeight: number,
    previousDate: Date,
    newWeight: number,
    newDate: Date,
  ): number | null {
    const msPerDay = 24 * 60 * 60 * 1000;
    const daysDiff =
      (newDate.getTime() - previousDate.getTime()) / msPerDay;
    if (daysDiff <= 0) return null;
    const gain = (Number(newWeight) - Number(previousWeight)) / daysDiff;
    return Math.round(gain * 1000) / 1000;
  }

  async updateCharacteristicsWithManager(
    idCattle: string,
    characteristics: string[],
    idTenant: string,
    manager: EntityManager,
  ): Promise<void> {
    if (!characteristics?.length) {
      await manager.delete(CattleCharacteristic, { idCattle });
      return;
    }
    const counts: Record<string, number> = {
      HEAD: 0,
      BELLY: 0,
      LEGS: 0,
      FEET: 0,
      HALF_HEAD: 0,
      SPOTS: 0,
      PATTERN: 0,
    };
    for (const char of characteristics) {
      if (char.includes('HALF_HEAD')) counts.HALF_HEAD++;
      else if (char.includes('HEAD')) counts.HEAD++;
      else if (char.includes('BELLY')) counts.BELLY++;
      else if (char.includes('LEGS')) counts.LEGS++;
      else if (char.includes('FEET')) counts.FEET++;
      else if (char.includes('SPOTS')) counts.SPOTS++;
      else if (char.includes('PATTERN')) counts.PATTERN++;
    }
    if (counts.HEAD > 1)
      throw new BadRequestException(
        'Cannot have more than 1 Head characteristic',
      );
    if (counts.BELLY > 1)
      throw new BadRequestException(
        'Cannot have more than 1 Belly characteristic',
      );
    if (counts.LEGS > 1)
      throw new BadRequestException(
        'Cannot have more than 1 Legs characteristic',
      );
    if (counts.FEET > 1)
      throw new BadRequestException(
        'Cannot have more than 1 Feet characteristic',
      );
    if (counts.SPOTS > 1)
      throw new BadRequestException(
        'Cannot have more than 1 Spots characteristic',
      );
    if (counts.PATTERN > 1)
      throw new BadRequestException(
        'Cannot have more than 1 Pattern characteristic',
      );
    if (counts.HALF_HEAD > 2)
      throw new BadRequestException(
        'Cannot have more than 2 Half Head characteristics',
      );
    await manager.delete(CattleCharacteristic, { idCattle });
    const newChars = characteristics.map((char) => {
      const entity = new CattleCharacteristic();
      entity.idCattle = idCattle;
      entity.characteristic = char;
      entity.idTenant = { id: idTenant } as any;
      return entity;
    });
    await manager.save(CattleCharacteristic, newChars);
  }

  async remove(idTenant: string, id: string): Promise<void> {
    await this.cattleRepository.delete(idTenant, id);
  }

  async findByAnyEartag(
    idTenant: string,
    eartag: string,
    manager?: EntityManager,
  ): Promise<Cattle | null> {
    return await this.cattleRepository.findByAnyEartag(
      idTenant,
      eartag,
      manager,
    );
  }

  async findByNumber(
    idTenant: string,
    number: string,
    manager?: EntityManager,
  ): Promise<Cattle | null> {
    return await this.cattleRepository.findByNumberAndTenantId(
      idTenant,
      number,
      manager,
    );
  }

  list(idTenant: string): Promise<Cattle[]> {
    return this.cattleRepository.findAll(idTenant);
  }

  async search(idTenant: string, query: string): Promise<Cattle[]> {
    if (!query || query.trim().length === 0) return [];
    const statuses = [CattleStatus.ACTIVE];
    return this.cattleRepository.search(idTenant, query, statuses);
  }

  async listPaged(
    idTenant: string,
    q: CattleListQueryDto,
  ): Promise<{
    page: number;
    limit: number;
    total: number;
    items: any[];
  }> {
    const page = Math.max(1, q.page ?? 1);
    const limit = Math.max(1, q.limit ?? 10);
    const { total, rows } = await this.cattleRepository.listPaged(
      idTenant,
      q,
      page,
      limit,
    );
    const tenantGainConfig =
      await this.configurationsService.getTenantConfiguration(
        idTenant,
        'average_daily_gain',
      );
    const tenantGainKg = tenantGainConfig
      ? parseFloat(tenantGainConfig.value)
      : 0;
    const items = await Promise.all(
      rows.map(async (cattle) => {
        const [weightHistory, medicationHistory] = await Promise.all([
          this.cattleWeightHistoryRepository.findByCattle(idTenant, cattle.id),
          this.cattleMedicationHistoryRepository.findByCattle(
            idTenant,
            cattle.id,
          ),
        ]);
        const lastWeight =
          cattle.lastWeight != null ? Number(cattle.lastWeight) : null;
        const lastEntry =
          weightHistory.length > 0
            ? weightHistory[weightHistory.length - 1]
            : null;
        const lastWeightDate = lastEntry ? new Date(lastEntry.date) : null;
        const gainPerDayKg =
          cattle.averageDailyGain != null
            ? Number(cattle.averageDailyGain)
            : tenantGainKg;
        const daysSince = lastWeightDate
          ? (Date.now() - lastWeightDate.getTime()) / (1000 * 60 * 60 * 24)
          : 0;
        const estimatedWeight =
          lastWeight != null
            ? Math.round((lastWeight + gainPerDayKg * daysSince) * 100) / 100
            : null;
        return {
          ...cattle,
          weightHistory,
          medicationHistory,
          estimatedWeight,
        };
      }),
    );
    return { page, limit, total, items };
  }

  async validateCattleByNumber(
    number: string,
    idTenant: string,
  ): Promise<Cattle> {
    const cattle = await this.cattleRepository.findByNumberAndTenantId(
      idTenant,
      number,
    );
    if (!cattle) {
      throw new BadRequestException(
        `Cattle with number ${number} not found for this tenant`,
      );
    }
    if (cattle.status !== 'ACTIVE') {
      let message = `Cattle ${number} cannot be added to sale. `;
      if (cattle.status === 'SOLD') {
        message += 'This cattle has already been sold.';
      } else if (cattle.status === 'DEAD') {
        message += 'This cattle is marked as dead.';
      } else if (cattle.status === 'LOST') {
        message += 'This cattle is marked as lost.';
      } else {
        message += `Status: ${cattle.status}`;
      }
      throw new BadRequestException(message);
    }
    return cattle;
  }

  async recordWeightHistory(
    cattleId: string,
    dto: any,
    idTenant: string,
    userId: string,
  ): Promise<CattleWeightHistory> {
    const cattle = await this.cattleRepository.findOne(idTenant, cattleId);
    if (!cattle) {
      throw new NotFoundException('Cattle not found');
    }
    this.validateStatusForApplyEvents(cattle.status);
    const weightHistory: Partial<CattleWeightHistory> = {
      idCattle: cattleId,
      weight: dto.weight,
      date: new Date(dto.measuredDate || new Date()),
      recordedBy: userId,
      idTenant,
      context: WeightContext.MANUAL,
    };
    return this.cattleWeightHistoryRepository.create(weightHistory);
  }

  async addMedicationHistory(
    idTenant: string,
    idCattle: string,
    dto: any,
    userId: string,
  ): Promise<CattleMedicationHistory> {
    const cattle = await this.cattleRepository.findOne(idTenant, idCattle);
    if (!cattle) {
      throw new NotFoundException('Cattle not found');
    }
    this.validateStatusForApplyEvents(cattle.status);
    const medicationHistory = new CattleMedicationHistory();
    medicationHistory.idTenant = idTenant;
    medicationHistory.idCattle = idCattle;
    medicationHistory.medicationName = dto.medicationName;
    medicationHistory.dosage = dto.dosage;
    medicationHistory.route = dto.route;
    medicationHistory.lot = dto.lot;
    medicationHistory.recordedBy = userId;
    medicationHistory.appliedAt = dto.appliedAt
      ? new Date(dto.appliedAt)
      : new Date();
    return this.cattleMedicationHistoryRepository.create(medicationHistory);
  }

  async updateCattleWeight(
    cattleId: string,
    weight: number,
    idTenant: string,
  ): Promise<any> {
    const cattle = await this.cattleRepository.findOne(idTenant, cattleId);
    if (!cattle) {
      throw new NotFoundException('Cattle not found');
    }
    this.validateStatusForApplyEvents(cattle.status);
    await this.cattleRepository.update(idTenant, cattleId, {
      lastWeight: weight,
    });
    return { success: true, message: 'Weight updated successfully' };
  }

  async bulkUpdateStatus(
    cattleIds: string[],
    status: string,
    idTenant: string,
  ): Promise<any> {
    const results: any[] = [];
    for (const id of cattleIds) {
      try {
        const cattle = await this.cattleRepository.findOne(idTenant, id);
        if (cattle) {
          await this.cattleRepository.update(idTenant, id, { status });
          results.push({ id, success: true });
        } else {
          results.push({ id, success: false, error: 'Cattle not found' });
        }
      } catch (error) {
        results.push({ id, success: false, error: error.message });
      }
    }
    return {
      totalProcessed: cattleIds.length,
      successful: results.filter((r) => r.success).length,
      failed: results.filter((r) => !r.success).length,
      results,
    };
  }

  async getBasicInfo(idTenant: string): Promise<any[]> {
    return this.cattleRepository.getBasicInfo(idTenant);
  }

  async getBasicInfoPaged(
    idTenant: string,
    query: CattleBasicQueryDto,
  ): Promise<any> {
    const { limit, cursor, updated_after } = query;
    const updatedAfter = updated_after
      ? new Date(updated_after)
      : undefined;
    return this.cattleRepository.getBasicInfoPaged({
      idTenant,
      limit,
      cursor,
      updatedAfter,
    });
  }

  validateStatusForApplyEvents(status: string): void {
    if (status !== CattleStatus.ACTIVE) {
      throw new BadRequestException('cattleIsNotActive');
    }
  }

  async import(file: Express.Multer.File, idTenant: string): Promise<any> {
    try {
      if (!file || !(file as any).path) {
        throw new BadRequestException(
          'No se ha proporcionado un archivo válido',
        );
      }
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.readFile((file as any).path);
      const worksheet = workbook.worksheets[0];
      if (!worksheet) {
        throw new BadRequestException(
          'The Excel sheet does not exist or is empty',
        );
      }
      const datos = await this.processSheet(worksheet, idTenant);
      return datos;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Error processing the Excel file: ${error.message}`,
      );
    } finally {
      if (file && (file as any).path) {
        try {
          fs.unlink((file as any).path, (err) => {
            if (err) {
              this.logger.error(
                `Error deleting file ${(file as any).path}: ${err.message}`,
              );
            } else {
              this.logger.debug(
                `File ${file.originalname} deleted from ${(file as any).path}`,
              );
            }
          });
        } catch (unlinkError) {
          this.logger.error(
            `Error in finally block: ${unlinkError.message}`,
          );
        }
      }
    }
  }

  private async processSheet(
    worksheet: ExcelJS.Worksheet,
    idTenant: string,
  ): Promise<any> {
    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[],
    };
    if (worksheet.rowCount < 2) {
      results.errors.push(
        'El archivo Excel no contiene datos para procesar',
      );
      return results;
    }
    for (let rowNumber = 2; rowNumber <= worksheet.rowCount; rowNumber++) {
      try {
        const row = worksheet.getRow(rowNumber);
        const rowValues = Array.isArray(row.values)
          ? row.values
              .slice(1)
              .map((v: any) =>
                typeof v === 'object' && v?.result !== undefined
                  ? v.result
                  : v,
              )
          : [];
        if (rowValues.length === 0) {
          results.errors.push(`Row ${rowNumber} is empty`);
          results.failed++;
          continue;
        }
        if (rowValues.length < 24) {
          results.errors.push(
            `Row ${rowNumber} has not enough columns (it has ${rowValues.length} columns, it should have 24 )`,
          );
          results.failed++;
          continue;
        }
        try {
          const cattle = await this.processExcelRow(
            rowValues,
            rowNumber,
            idTenant,
          );
          results.success++;
          continue;
        } catch (error) {
          if (error instanceof BadRequestException) {
            results.errors.push(`Row ${rowNumber}: ${error.message}`);
          } else {
            results.errors.push(
              `Row ${rowNumber}: Error creating cattle`,
            );
          }
          results.failed++;
        }
      } catch (error) {
        results.errors.push(`Row ${rowNumber}: ${error.message}`);
        results.failed++;
      }
    }
    this.logger.debug(
      `Procesamiento completado: ${results.success} éxitos, ${results.failed} fallos`,
    );
    return results;
  }

  private async processExcelRow(
    rowValues: any[],
    rowNumber: number,
    idTenant: string,
  ): Promise<Cattle> {
    if (!rowValues[0]) {
      throw new BadRequestException(`has no system number`);
    } else {
      const cattle =
        await this.cattleRepository.findBySysNumberAndTenantId(
          idTenant,
          rowValues[0],
        );
      if (cattle) {
        throw new BadRequestException(
          `system number ${rowValues[0]} already exists`,
        );
      }
    }
    if (!rowValues[1]) {
      throw new BadRequestException(
        `system number ${rowValues[0]} has no cattle number`,
      );
    } else {
      const cattle = await this.cattleRepository.findByNumberAndTenantId(
        idTenant,
        rowValues[1],
      );
      if (cattle) {
        throw new BadRequestException(
          `cattle number ${rowValues[1]} already exists`,
        );
      }
    }
    if (!rowValues[7]) {
      throw new BadRequestException(
        `system number ${rowValues[0]} has no received at date`,
      );
    }
    if (!rowValues[9]) {
      throw new BadRequestException(
        `system number ${rowValues[0]} has no reception weight`,
      );
    }
    if (!rowValues[8]) {
      throw new BadRequestException(
        `system number ${rowValues[0]} has no purchase weight `,
      );
    }
    if (!rowValues[23]) {
      throw new BadRequestException(
        `system number ${rowValues[0]} has no purchase from `,
      );
    }
    if (!rowValues[13]) {
      throw new BadRequestException(
        `system number ${rowValues[0]} has no purchase price `,
      );
    }
    const dto = new CreateCattleDto();
    (dto as any).idTenant = idTenant;
    dto.sysNumber = rowValues[0];
    dto.number = rowValues[1];
    if (rowValues[2]) {
      dto.brand = rowValues[2];
    }
    dto.receivedAt = rowValues[7];
    dto.receivedWeight = rowValues[9];
    dto.purchaseWeight = rowValues[8];
    if (rowValues[10]) {
      dto.comments = rowValues[10];
    }
    dto.purchasedFrom = rowValues[23];
    dto.purchasePrice = rowValues[13];
    if (rowValues[14]) {
      dto.purchaseCommission = rowValues[14];
    }
    if (rowValues[15]) {
      dto.negotiatedPricePerKg = rowValues[15];
    }
    if (rowValues[17]) {
      dto.lotPricePerWeight = rowValues[17];
    }
    if (rowValues[22]) {
      dto.averageGr = rowValues[22];
    }
    if (rowValues[21]) {
      dto.saleWeight = rowValues[21];
    }
    if (rowValues[34]) {
      dto.salePricePerKg = rowValues[34];
    }
    if (rowValues[36]) {
      dto.salePrice = rowValues[36];
    }
    try {
      const cattle = await this.cattleRepository.create(dto as any);
      return cattle;
    } catch (error) {
      this.logger.error(error);
      this.logger.debug(
        `Row ${rowNumber}, system number ${rowValues[0]} has error creating cattle. ${error.message}`,
      );
      throw new BadRequestException(
        `system number ${rowValues[0]} has error creating cattle.`,
      );
    }
  }
}

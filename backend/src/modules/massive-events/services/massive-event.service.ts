import { Injectable, Logger, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { MassiveEventRepository } from '../repositories/massive-event.repository';
import { SimpleEventRepository } from '../repositories/simple-event.repository';
import { AnimalSimpleEventRepository } from '../repositories/animal-simple-event.repository';
import { CattleRepository } from '../../farm/repositories/cattle.repository';
import { SimpleEvent } from '../entities/simple-event.entity';
import { MassiveEvent } from '../entities/massive-events.entity';
import { v4 as uuidv4 } from 'uuid';
import { CreateMassiveEventDto } from '../dto/create-massive-event.dto';

@Injectable()
export class MassiveEventService {
  private readonly logger = new Logger(MassiveEventService.name);

  constructor(
    private readonly dataSource: DataSource,
    private readonly massiveEventRepo: MassiveEventRepository,
    private readonly simpleEventRepo: SimpleEventRepository,
    private readonly simpleEventCattleRepository: AnimalSimpleEventRepository,
    private readonly cattleRepository: CattleRepository,
  ) {}

  async saveMassiveAndSimples(manager: EntityManager, payload: any): Promise<MassiveEvent> {
    let massiveEvent = await manager.findOne(MassiveEvent, {
      where: { id: payload.id, idTenant: payload.idTenant },
    });

    if (!massiveEvent) {
      massiveEvent = this.massiveEventRepo.createInstance({
        id: payload.id,
        idTenant: payload.idTenant,
        eventDate: new Date(payload.eventDate),
        status: payload.status,
        createdBy: payload.createdBy,
        createdAt: payload.createdAt ? new Date(payload.createdAt) : undefined,
        updatedAt: payload.updatedAt ? new Date(payload.updatedAt) : undefined,
      });
      await this.massiveEventRepo.saveWithManager(manager, massiveEvent);
    }

    var simpleEvents: SimpleEvent[] = [];
    if (payload.simpleEvents?.length) {
      for (const se of payload.simpleEvents) {
        const exists = await manager.findOne(SimpleEvent, { where: { id: se.id } });
        if (!exists) {
          const simpleEvent = this.simpleEventRepo.createInstance({
            id: se.id,
            idMassiveEvent: massiveEvent.id,
            idTenant: payload.idTenant,
            type: se.type,
            data: se.dataJson ? JSON.parse(se.dataJson) : null,
            createdAt: se.createdAt ? new Date(se.createdAt) : undefined,
          });
          const simEv = await this.simpleEventRepo.saveWithManager(manager, simpleEvent);
          simpleEvents.push(simEv);
        } else {
          simpleEvents.push(exists);
        }
      }
    }

    massiveEvent.simpleEvents = simpleEvents;
    return massiveEvent;
  }

  async createMassiveEvent(idTenant: string, createdBy: string, dto: CreateMassiveEventDto): Promise<MassiveEvent> {
    return this.dataSource.transaction(async (manager) => {
      const payload = {
        id: uuidv4(),
        idTenant,
        eventDate: dto.eventDate,
        status: 'open',
        createdBy,
        simpleEvents: dto.simpleEvents?.map((se) => ({
          id: uuidv4(),
          type: se.type,
          dataJson: se.data ? JSON.stringify(se.data) : undefined,
        })),
      };
      const massiveEvent = await this.saveMassiveAndSimples(manager, payload);
      return massiveEvent;
    });
  }

  async syncMassiveEvents(idTenant: string, dtos: any[]): Promise<any[]> {
    return this.dataSource.transaction(async (manager) => {
      const results: any[] = [];
      for (const dto of dtos) {
        const saved = await this.saveMassiveAndSimples(manager, { ...dto, idTenant });
        results.push({ id: saved.id, status: 'synced' });
      }
      return results;
    });
  }

  async createMassiveEvent1(idTenant: string, createdBy: string, dto: CreateMassiveEventDto): Promise<MassiveEvent> {
    return this.dataSource.transaction(async (manager) => {
      const massiveEvent = this.massiveEventRepo.createInstance({
        id: uuidv4(),
        idTenant,
        eventDate: new Date(dto.eventDate),
        status: 'open',
        createdBy,
      });
      await this.massiveEventRepo.saveWithManager(manager, massiveEvent);

      const createdSimpleEvents: SimpleEvent[] = [];
      if (dto.simpleEvents && dto.simpleEvents.length > 0) {
        for (const se of dto.simpleEvents) {
          const simpleEvent = this.simpleEventRepo.createInstance({
            idMassiveEvent: massiveEvent.id,
            type: se.type,
            data: se.data ?? null,
          });
          createdSimpleEvents.push(await this.simpleEventRepo.saveWithManager(manager, simpleEvent));
        }
      }

      massiveEvent.simpleEvents = createdSimpleEvents;
      return massiveEvent;
    });
  }

  async findByIdOrFail(idTenant: string, idMassiveEvent: string, manager?: EntityManager): Promise<MassiveEvent> {
    const massiveEvent = await this.massiveEventRepo.findById(idTenant, idMassiveEvent, manager);
    if (!massiveEvent) throw new NotFoundException(`MassiveEvent ${idMassiveEvent} not found`);
    return massiveEvent;
  }

  async findWithSimpleEventsByIdOrFail(idTenant: string, idMassiveEvent: string, manager?: EntityManager): Promise<MassiveEvent> {
    const massiveEvent = await this.massiveEventRepo.findOneWithSimpleEvents(idTenant, idMassiveEvent, manager);
    if (!massiveEvent) throw new NotFoundException(`MassiveEvent ${idMassiveEvent} not found`);
    return massiveEvent;
  }

  async findCattleByMassiveEvent(idTenant: string, idMassiveEvent: string): Promise<any[]> {
    const simpleEvents = await this.simpleEventRepo.findByMassiveEvent(idTenant, idMassiveEvent);
    const simpleEventIds = simpleEvents.map((ev) => ev.id);
    if (simpleEventIds.length === 0) {
      return [];
    }

    const links = await this.simpleEventCattleRepository.findBySimpleEvents(idTenant, simpleEventIds);
    const cattleIds = links.map((link) => link.idAnimal).filter(Boolean);
    const cattleList = await this.cattleRepository.findByIds(idTenant, cattleIds);

    return cattleList.map((cattle: any) => {
      return {
        id: cattle.id,
        number: cattle.number,
        idBrand: cattle.idBrand,
        lastWeight: cattle.lastWeight,
        appliedAt: links.find((l) => l.idAnimal === cattle.id)?.appliedAt,
      };
    });
  }

  async findAll(idTenant: string): Promise<MassiveEvent[]> {
    return this.massiveEventRepo.findAllByTenant(idTenant);
  }

  async closeMassiveEvent(idTenant: string, id: string): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      const massiveEvent = await this.findByIdOrFail(idTenant, id, manager);
      await this.simpleEventRepo.deleteUnappliedByMassiveEvent(manager, idTenant, id);
      const simpleEvents = await this.simpleEventRepo.findByMassiveEvent(idTenant, id);
      if (simpleEvents.length === 0) {
        throw new HttpException('No simple events applied', HttpStatus.UNPROCESSABLE_ENTITY);
      }
      await this.massiveEventRepo.updateByIdWithManager(manager, id, idTenant, { status: 'closed' });
    });
  }

  async deleteMassiveEvent(idTenant: string, id: string): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      const event = await this.findByIdOrFail(idTenant, id, manager);
      await this.simpleEventRepo.deleteByMassiveEvent(manager, id);
      await this.massiveEventRepo.deleteByIdWithManager(manager, id, idTenant);
    });
  }
}

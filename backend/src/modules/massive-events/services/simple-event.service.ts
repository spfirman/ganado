import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { SimpleEventRepository } from '../repositories/simple-event.repository';
import { DataSource, EntityManager } from 'typeorm';
import { SimpleEvent } from '../entities/simple-event.entity';
import { v4 as uuidv4 } from 'uuid';
import { MassiveEventService } from './massive-event.service';
import { CreateSimpleEventDto } from '../dto/create-simple-event.dto';
import { UpdateSimpleEventDto } from '../dto/update-simple-events.dto';

@Injectable()
export class SimpleEventService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly simpleEventRepo: SimpleEventRepository,
    private readonly massiveEventSevice: MassiveEventService,
  ) {}

  async createSimpleEvent12(idTenant: string, dto: CreateSimpleEventDto): Promise<SimpleEvent> {
    await this.massiveEventSevice.findByIdOrFail(idTenant, dto.idMassiveEvent);
    const typesWithData = ['brand', 'medication'];
    if (typesWithData.includes(dto.type)) {
      if (!dto.data) {
        throw new BadRequestException(`Data is required for type ${dto.type}`);
      }
    } else {
      if (dto.data) {
        throw new BadRequestException(`Data is not allowed for type ${dto.type}`);
      }
    }
    const simpleEvent = this.simpleEventRepo.createInstance({
      idMassiveEvent: dto.idMassiveEvent,
      type: dto.type,
      data: dto.data ?? null,
    });
    return this.simpleEventRepo.save(simpleEvent);
  }

  async saveNewSimpleEvent(manager: EntityManager, payload: any): Promise<SimpleEvent> {
    const exists = await manager.findOne(SimpleEvent, { where: { id: payload.id } });
    if (exists) return exists;

    if (payload.idMassiveEvent == null || payload.idMassiveEvent.trim() === '') {
      throw new BadRequestException('idMassiveEvent is required');
    }

    this.validateDataFields(payload.type, payload.dataJson);

    const simpleEvent = this.simpleEventRepo.createInstance({
      id: payload.id,
      idMassiveEvent: payload.idMassiveEvent,
      idTenant: payload.idTenant,
      type: payload.type,
      data: payload.dataJson ? JSON.parse(payload.dataJson) : null,
      createdAt: payload.createdAt ? new Date(payload.createdAt) : new Date(),
    });

    return this.simpleEventRepo.saveWithManager(manager, simpleEvent);
  }

  async createSimpleEvent(idTenant: string, dto: CreateSimpleEventDto): Promise<SimpleEvent> {
    await this.massiveEventSevice.findByIdOrFail(idTenant, dto.idMassiveEvent);
    return this.dataSource.transaction((manager) =>
      this.saveNewSimpleEvent(manager, {
        id: uuidv4(),
        idMassiveEvent: dto.idMassiveEvent,
        idTenant,
        type: dto.type,
        dataJson: dto.data ? JSON.stringify(dto.data) : undefined,
      }),
    );
  }

  async syncSimpleEvents(idTenant: string, dtos: any[]): Promise<any[]> {
    return this.dataSource.transaction(async (manager) => {
      const results: any[] = [];
      for (const dto of dtos) {
        let massiveEvent;
        try {
          massiveEvent = await this.massiveEventSevice.findByIdOrFail(idTenant, dto.massiveEventServerId);
        } catch (error) {
          results.push({ id: dto.id, status: 'failed', serverId: '', message: 'MassiveEvent not found' });
          continue;
        }
        const saved = await this.saveNewSimpleEvent(manager, {
          id: dto.id,
          idMassiveEvent: massiveEvent.id,
          idTenant,
          type: dto.type,
          dataJson: dto.dataJson,
          createdAt: dto.createdAt,
        });
        results.push({ id: saved.id, status: 'synced', serverId: saved.id });
      }
      return results;
    });
  }

  async findByIdOrFail(idTenant: string, id: string, manager?: EntityManager): Promise<SimpleEvent> {
    const simpleEvent = await this.simpleEventRepo.findById(idTenant, id, manager);
    if (!simpleEvent) throw new NotFoundException(`SimpleEvent ${id} not found`);
    return simpleEvent;
  }

  async findByMassiveEvent(idTenant: string, idMassiveEvent: string): Promise<SimpleEvent[]> {
    return this.simpleEventRepo.findByMassiveEvent(idTenant, idMassiveEvent);
  }

  async delete(id: string): Promise<void> {
    return this.simpleEventRepo.deleteById(id);
  }

  async deleteByMassiveEvent(manager: EntityManager, idMassiveEvent: string): Promise<void> {
    return this.simpleEventRepo.deleteByMassiveEvent(manager, idMassiveEvent);
  }

  validateDataFields(type: string, dataInput: any): void {
    if (type == 'eartag') {
      let data: any;
      if (typeof dataInput === 'string') {
        if (dataInput.trim() === '') {
          throw new BadRequestException('dataJson is required for type eartag');
        }
        data = JSON.parse(dataInput);
      } else if (dataInput && typeof dataInput === 'object') {
        data = dataInput;
      } else {
        throw new BadRequestException('data is required for type eartag');
      }
      const left = typeof data.eartagLeft === 'string' ? data.eartagLeft.trim() : '';
      const right = typeof data.eartagRight === 'string' ? data.eartagRight.trim() : '';
      if (left.length === 0 && right.length === 0) {
        throw new BadRequestException('dataJson is invalid for type eartag');
      }
    }

    if (type == 'medication') {
      let data: any;
      if (typeof dataInput === 'string') {
        if (dataInput.trim() === '') {
          throw new BadRequestException('dataJson is required for type medication');
        }
        data = JSON.parse(dataInput);
      } else if (dataInput && typeof dataInput === 'object') {
        data = dataInput;
      } else {
        throw new BadRequestException('data is required for type medication');
      }
      const requiredKeys = ['medicationName', 'dosage', 'lot'];
      const dataKeys = Object.keys(data);
      const hasAllKeys = requiredKeys.every((k) => dataKeys.includes(k));
      if (!hasAllKeys) {
        throw new BadRequestException('dataJson is invalid for type medication');
      }
      var isValid = requiredKeys.every((key) => typeof data[key] === 'string' && data[key].trim().length > 0);
      if (!isValid) {
        throw new BadRequestException('dataJson is invalid for type medication');
      }
    }
  }

  async updateSimpleEvent(idTenant: string, id: string, dto: UpdateSimpleEventDto): Promise<SimpleEvent> {
    return this.dataSource.transaction(async (manager) => {
      const simpleEvent = await this.findByIdOrFail(idTenant, id, manager);
      this.validateDataFields(simpleEvent.type, dto.data);
      return this.simpleEventRepo.updateSimpleEvent(id, dto, manager);
    });
  }

  findByIds(idTenant: string, ids: string[], manager?: EntityManager): Promise<SimpleEvent[]> {
    return this.simpleEventRepo.findByIds(idTenant, ids, manager);
  }
}

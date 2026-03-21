import { Injectable, Logger } from '@nestjs/common';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { MassiveEvent } from '../entities/massive-events.entity';

@Injectable()
export class MassiveEventRepository {
  private readonly logger = new Logger(MassiveEventRepository.name);
  private readonly repository: Repository<MassiveEvent>;

  constructor(private readonly dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(MassiveEvent);
  }

  createInstance(data: Partial<MassiveEvent>): MassiveEvent {
    return this.repository.create(data);
  }

  async save(entity: MassiveEvent): Promise<MassiveEvent> {
    return this.repository.save(entity);
  }

  async saveWithManager(manager: EntityManager, entity: Partial<MassiveEvent>): Promise<MassiveEvent> {
    return manager.save(MassiveEvent, entity);
  }

  async updateByIdWithManager(manager: EntityManager, id: string, idTenant: string, data: Partial<MassiveEvent>): Promise<void> {
    await manager.update(MassiveEvent, { id, idTenant }, data);
  }

  async findById(idTenant: string, id: string, manager?: EntityManager): Promise<MassiveEvent | null> {
    const repo = manager?.getRepository(MassiveEvent) ?? this.repository;
    return await repo.findOne({ where: { id, idTenant } });
  }

  async findOneWithSimpleEvents(idTenant: string, idMassiveEvent: string, manager?: EntityManager): Promise<MassiveEvent | null> {
    const repo = manager?.getRepository(MassiveEvent) ?? this.repository;
    return await repo.findOne({
      where: { idTenant, id: idMassiveEvent },
      relations: ['simpleEvents'],
    });
  }

  async findAllByTenant(idTenant: string): Promise<MassiveEvent[]> {
    return this.repository.find({ where: { idTenant } });
  }

  async deleteById(id: string, idTenant: string): Promise<void> {
    await this.repository.delete({ id, idTenant });
  }

  async deleteByIdWithManager(manager: EntityManager, id: string, idTenant: string): Promise<void> {
    await manager.delete(MassiveEvent, { id, idTenant });
  }
}

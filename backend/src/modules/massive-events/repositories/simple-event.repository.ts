import { Injectable, Logger } from '@nestjs/common';
import { DataSource, EntityManager, Repository, In } from 'typeorm';
import { SimpleEvent } from '../entities/simple-event.entity';
import { AnimalSimpleEvent } from '../entities/animal-simple-event.entity';
import { UpdateSimpleEventDto } from '../dto/update-simple-events.dto';

@Injectable()
export class SimpleEventRepository {
  private readonly logger = new Logger(SimpleEventRepository.name);
  private readonly repository: Repository<SimpleEvent>;

  constructor(private readonly dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(SimpleEvent);
  }

  createInstance(data: Partial<SimpleEvent>): SimpleEvent {
    return this.repository.create(data);
  }

  async save(entity: SimpleEvent): Promise<SimpleEvent> {
    return this.repository.save(entity);
  }

  async saveWithManager(manager: EntityManager, entity: Partial<SimpleEvent>): Promise<SimpleEvent> {
    return manager.save(SimpleEvent, entity);
  }

  async findById(idTenant: string, id: string, manager?: EntityManager): Promise<SimpleEvent | null> {
    const repo = manager?.getRepository(SimpleEvent) ?? this.repository;
    return await repo.findOne({ where: { idTenant, id } });
  }

  async findByMassiveEvent(idTenant: string, idMassiveEvent: string, manager?: EntityManager): Promise<SimpleEvent[]> {
    const repo = manager?.getRepository(SimpleEvent) ?? this.repository;
    return repo.find({ where: { idTenant, idMassiveEvent } });
  }

  async deleteById(id: string): Promise<void> {
    await this.repository.delete({ id });
  }

  async deleteByIdWithManager(manager: EntityManager, id: string): Promise<void> {
    await manager.delete(SimpleEvent, { id });
  }

  async deleteByMassiveEvent(manager: EntityManager, idMassiveEvent: string): Promise<void> {
    await manager.delete(SimpleEvent, { idMassiveEvent });
  }

  async deleteUnappliedByMassiveEvent(manager: EntityManager, idTenant: string, idMassiveEvent: string): Promise<number> {
    const sub = manager
      .createQueryBuilder()
      .select('se.id')
      .from(SimpleEvent, 'se')
      .where('se.idTenant = :idTenant', { idTenant })
      .andWhere('se.idMassiveEvent = :idMassiveEvent', { idMassiveEvent })
      .andWhere(() => {
        const notExists = manager
          .createQueryBuilder()
          .subQuery()
          .select('1')
          .from(AnimalSimpleEvent, 'ase')
          .where('ase.idSimpleEvent = se.id')
          .andWhere('ase.idTenant = se.idTenant')
          .getQuery();
        return `NOT EXISTS (${notExists})`;
      });

    const res = await manager
      .createQueryBuilder()
      .delete()
      .from(SimpleEvent)
      .where(`id IN (${sub.getQuery()})`)
      .setParameters(sub.getParameters())
      .execute();

    return res.affected ?? 0;
  }

  findByIds(idTenant: string, ids: string[], manager?: EntityManager): Promise<SimpleEvent[]> {
    const repo = manager?.getRepository(SimpleEvent) ?? this.repository;
    return repo.find({ where: { idTenant, id: In(ids) } });
  }

  updateSimpleEvent(id: string, dto: UpdateSimpleEventDto, manager: EntityManager): Promise<SimpleEvent> {
    return manager.save(SimpleEvent, {
      id,
      data: dto.data,
      isActive: dto.isActive,
    });
  }
}

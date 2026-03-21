import { Injectable, Logger } from '@nestjs/common';
import { DataSource, EntityManager, In, Repository } from 'typeorm';
import { AnimalSimpleEvent } from '../entities/animal-simple-event.entity';

@Injectable()
export class AnimalSimpleEventRepository {
  private readonly logger = new Logger(AnimalSimpleEventRepository.name);
  private readonly repository: Repository<AnimalSimpleEvent>;

  constructor(private readonly dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(AnimalSimpleEvent);
  }

  createInstance(data: Partial<AnimalSimpleEvent>): AnimalSimpleEvent {
    return this.repository.create(data);
  }

  async saveAnimalSimpleEvent(entity: AnimalSimpleEvent): Promise<AnimalSimpleEvent> {
    return this.repository.save(entity);
  }

  async saveWithManager(manager: EntityManager, entity: AnimalSimpleEvent): Promise<AnimalSimpleEvent> {
    return manager.save(AnimalSimpleEvent, entity);
  }

  async findById(idTenant: string, id: string): Promise<AnimalSimpleEvent | null> {
    return this.repository.findOne({ where: { idTenant, id } });
  }

  async findByCattle(idTenant: string, idCattle: string, manager?: EntityManager): Promise<AnimalSimpleEvent[]> {
    const repo = manager?.getRepository(AnimalSimpleEvent) ?? this.repository;
    return repo.find({ where: { idTenant, idAnimal: idCattle } });
  }

  async findBySimpleEvent(idSimpleEvent: string): Promise<AnimalSimpleEvent[]> {
    return this.repository.find({ where: { idSimpleEvent } });
  }

  async findBySimpleEvents(idTenant: string, simpleEventIds: string[]): Promise<AnimalSimpleEvent[]> {
    return this.repository.find({ where: { idTenant, idSimpleEvent: In(simpleEventIds) } });
  }

  async deleteById(idTenant: string, id: string): Promise<void> {
    await this.repository.delete({ idTenant, id });
  }

  async deleteByIdWithManager(manager: EntityManager, idTenant: string, id: string): Promise<void> {
    await manager.delete(AnimalSimpleEvent, { idTenant, id });
  }

  async insertMany(rows: Partial<AnimalSimpleEvent>[], manager?: EntityManager): Promise<void> {
    if (!rows?.length) return;
    const m = manager ?? this.dataSource.manager;
    await m
      .createQueryBuilder()
      .insert()
      .into(AnimalSimpleEvent)
      .values(rows)
      .orIgnore()
      .execute();
  }
}

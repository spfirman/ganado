import { Injectable, Logger } from '@nestjs/common';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { Lot } from '../entities/lot.entity';

@Injectable()
export class LotRepository {
  private readonly logger = new Logger(LotRepository.name);
  private readonly repository: Repository<Lot>;

  constructor(private readonly dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(Lot);
  }

  createInstance(data: Partial<Lot>): Lot {
    return this.repository.create(data);
  }

  async save(lot: Lot): Promise<Lot> {
    return this.repository.save(lot);
  }

  async saveWithManager(manager: EntityManager, lot: Partial<Lot>): Promise<Lot> {
    return manager.save(Lot, lot);
  }

  async deleteByPurchaseId(idPurchase: string, idTenant: string): Promise<void> {
    await this.repository.delete({ idPurchase, idTenant });
  }

  async deleteByPurchaseIdWithManager(
    manager: EntityManager,
    idPurchase: string,
    idTenant: string,
  ): Promise<void> {
    await manager.delete(Lot, { idPurchase, idTenant });
  }

  async findByPurchaseId(
    idPurchase: string,
    idTenant: string,
    manager?: EntityManager,
  ): Promise<Lot[]> {
    const repo = manager?.getRepository(Lot) ?? this.repository;
    return repo.find({ where: { idPurchase, idTenant } });
  }

  async findById(
    idTenant: string,
    id: string,
    manager?: EntityManager,
  ): Promise<Lot | null> {
    const repo = manager?.getRepository(Lot) ?? this.repository;
    const lot = await repo.findOne({ where: { id, idTenant } });
    return lot;
  }
}

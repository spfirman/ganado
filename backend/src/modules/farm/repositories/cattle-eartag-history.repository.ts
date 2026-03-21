import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { CattleEartagHistory } from '../entities/cattle-eartag-history.entity';

@Injectable()
export class CattleEartagHistoryRepository {
  constructor(
    @InjectRepository(CattleEartagHistory)
    private readonly repo: Repository<CattleEartagHistory>,
  ) {}

  async create(entity: Partial<CattleEartagHistory>): Promise<CattleEartagHistory> {
    return await this.repo.save(entity);
  }

  async createWithManager(
    manager: EntityManager,
    entity: Partial<CattleEartagHistory>,
  ): Promise<CattleEartagHistory> {
    return await manager.save(CattleEartagHistory, entity);
  }

  async findByCattle(idTenant: string, idCattle: string): Promise<CattleEartagHistory[]> {
    return await this.repo.find({
      where: { idTenant, idCattle },
      order: { assignedAt: 'DESC' },
    });
  }

  async findOneById(idTenant: string, id: string): Promise<CattleEartagHistory | null> {
    return await this.repo.findOne({ where: { idTenant, id } });
  }

  async update(entity: CattleEartagHistory): Promise<CattleEartagHistory> {
    return await this.repo.save(entity);
  }

  async updateWithManager(
    manager: EntityManager,
    entity: CattleEartagHistory,
  ): Promise<CattleEartagHistory> {
    return await manager.save(CattleEartagHistory, entity);
  }

  async deleteById(idTenant: string, id: string): Promise<void> {
    await this.repo.delete({ idTenant, id });
  }

  async deleteByIdWithManager(
    idTenant: string,
    id: string,
    manager: EntityManager,
  ): Promise<void> {
    await manager.delete(CattleEartagHistory, { idTenant, id });
  }
}

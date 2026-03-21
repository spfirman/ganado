import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { CattleWeightHistory, WeightContext } from '../entities/cattle-weight-history.entity';

@Injectable()
export class CattleWeightHistoryRepository {
  private readonly logger = new Logger(CattleWeightHistoryRepository.name);

  constructor(
    @InjectRepository(CattleWeightHistory)
    private readonly repo: Repository<CattleWeightHistory>,
  ) {}

  async create(
    entity: Partial<CattleWeightHistory>,
    manager?: EntityManager,
  ): Promise<CattleWeightHistory> {
    var repo: Repository<CattleWeightHistory> = this.repo;
    if (manager) {
      repo = manager.getRepository(CattleWeightHistory);
    }
    return await repo.save(entity);
  }

  async createWithManager(
    manager: EntityManager,
    entity: Partial<CattleWeightHistory>,
  ): Promise<CattleWeightHistory> {
    this.logger.debug('GUARDAR HISTORIA DE PESO');
    this.logger.debug(entity);
    return await manager.save(CattleWeightHistory, entity);
  }

  async findByCattle(
    idTenant: string,
    idCattle: string,
    manager?: EntityManager,
    context?: WeightContext,
  ): Promise<CattleWeightHistory[]> {
    var repo: Repository<CattleWeightHistory> = this.repo;
    if (manager) {
      repo = manager.getRepository(CattleWeightHistory);
    }
    if (!context) {
      return await repo.find({
        where: { idTenant, idCattle },
        order: { date: 'ASC' },
      });
    } else {
      return await repo.find({
        where: { idTenant, idCattle, context },
        order: { date: 'ASC' },
      });
    }
  }

  async findLastByCattle(
    idTenant: string,
    idCattle: string,
    manager?: EntityManager,
  ): Promise<CattleWeightHistory | null> {
    const repo = manager
      ? manager.getRepository(CattleWeightHistory)
      : this.repo;
    const list = await repo.find({
      where: { idTenant, idCattle },
      order: { date: 'DESC' },
      take: 1,
    });
    return list[0] ?? null;
  }

  async findOneById(idTenant: string, id: string): Promise<CattleWeightHistory | null> {
    return await this.repo.findOne({ where: { idTenant, id } });
  }

  async update(
    entity: CattleWeightHistory,
    manager?: EntityManager,
  ): Promise<CattleWeightHistory> {
    var repo: Repository<CattleWeightHistory> = this.repo;
    if (manager) {
      repo = manager.getRepository(CattleWeightHistory);
    }
    return await repo.save(entity);
  }

  async updateWithManager(
    manager: EntityManager,
    entity: CattleWeightHistory,
  ): Promise<CattleWeightHistory> {
    return await manager.save(CattleWeightHistory, entity);
  }

  async deleteById(idTenant: string, id: string): Promise<void> {
    await this.repo.delete({ idTenant, id });
  }

  async deleteByIdWithManager(
    idTenant: string,
    id: string,
    manager: EntityManager,
  ): Promise<void> {
    await manager.delete(CattleWeightHistory, { idTenant, id });
  }
}

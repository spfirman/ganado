import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { CattleMedicationHistory } from '../entities/cattle-medication-history.entity';

@Injectable()
export class CattleMedicationHistoryRepository {
  constructor(
    @InjectRepository(CattleMedicationHistory)
    private readonly repo: Repository<CattleMedicationHistory>,
  ) {}

  async create(entity: Partial<CattleMedicationHistory>): Promise<CattleMedicationHistory> {
    return await this.repo.save(entity);
  }

  async createWithManager(
    manager: EntityManager,
    entity: Partial<CattleMedicationHistory>,
  ): Promise<CattleMedicationHistory> {
    return await manager.save(CattleMedicationHistory, entity);
  }

  async findByCattle(
    idTenant: string,
    idCattle: string,
    manager?: EntityManager,
  ): Promise<CattleMedicationHistory[]> {
    var repo: Repository<CattleMedicationHistory> = this.repo;
    if (manager) {
      repo = manager.getRepository(CattleMedicationHistory);
    }
    return await repo.find({
      where: { idTenant, idCattle },
      order: { appliedAt: 'DESC' },
    });
  }

  async findOneById(idTenant: string, id: string): Promise<CattleMedicationHistory | null> {
    return await this.repo.findOne({ where: { idTenant, id } });
  }

  async update(entity: CattleMedicationHistory): Promise<CattleMedicationHistory> {
    return await this.repo.save(entity);
  }

  async updateWithManager(
    manager: EntityManager,
    entity: CattleMedicationHistory,
  ): Promise<CattleMedicationHistory> {
    return await manager.save(CattleMedicationHistory, entity);
  }

  async deleteById(idTenant: string, id: string): Promise<void> {
    await this.repo.delete({ idTenant, id });
  }

  async deleteByIdWithManager(
    idTenant: string,
    id: string,
    manager: EntityManager,
  ): Promise<void> {
    await manager.delete(CattleMedicationHistory, { idTenant, id });
  }
}

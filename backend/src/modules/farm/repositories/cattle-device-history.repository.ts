import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, EntityManager } from 'typeorm';
import { CattleDeviceHistory } from '../entities/cattle-device-history.entity';

@Injectable()
export class CattleDeviceHistoryRepository {
  constructor(
    @InjectRepository(CattleDeviceHistory)
    private readonly repo: Repository<CattleDeviceHistory>,
  ) {}

  async create(entity: Partial<CattleDeviceHistory>): Promise<CattleDeviceHistory> {
    return await this.repo.save(entity);
  }

  async createWithManager(
    manager: EntityManager,
    entity: Partial<CattleDeviceHistory>,
  ): Promise<CattleDeviceHistory> {
    return await manager.save(CattleDeviceHistory, entity);
  }

  async findByCattle(idTenant: string, idCattle: string): Promise<CattleDeviceHistory[]> {
    return await this.repo.find({
      where: {
        idTenant,
        idCattle,
      },
      order: { assignedAt: 'DESC' },
    });
  }

  async findOneById(idTenant: string, id: string): Promise<CattleDeviceHistory | null> {
    return await this.repo.findOne({
      where: { idTenant, id },
    });
  }

  async update(entity: CattleDeviceHistory): Promise<CattleDeviceHistory> {
    return await this.repo.save(entity);
  }

  async updateWithManager(
    manager: EntityManager,
    entity: CattleDeviceHistory,
  ): Promise<CattleDeviceHistory> {
    return await manager.save(CattleDeviceHistory, entity);
  }

  async deleteById(idTenant: string, id: string): Promise<void> {
    await this.repo.delete({ idTenant, id });
  }

  async deleteByIdWithManager(
    idTenant: string,
    id: string,
    manager: EntityManager,
  ): Promise<void> {
    await manager.delete(CattleDeviceHistory, { idTenant, id });
  }

  async assignDeviceToCattle(
    idDevice: string,
    idCattle: string,
    idTenant: string,
    assignedBy?: string,
    assignedAt?: Date,
    idMassiveEvent?: string,
    manager?: EntityManager,
  ): Promise<CattleDeviceHistory> {
    const repo = manager?.getRepository(CattleDeviceHistory) ?? this.repo;
    const activeAssignment = await repo.findOne({
      where: { idDevice, idTenant, unassignedAt: IsNull() },
    });
    if (activeAssignment) {
      if (activeAssignment.idCattle === idCattle) {
        return activeAssignment;
      }
      throw new BadRequestException('Este device ya está asignado a otro cattle.');
    }
    const newAssignment = repo.create({
      idCattle,
      idDevice,
      idTenant,
      assignedBy: assignedBy ?? undefined,
      idMassiveEvent: idMassiveEvent ?? undefined,
      assignedAt: assignedAt ?? new Date(),
    });
    await repo.save(newAssignment);
    return newAssignment;
  }

  async unassignDeviceByidDevice(
    idTenant: string,
    idDevice: string,
    manager?: EntityManager,
    unassignedAt?: Date,
  ): Promise<void> {
    const repo = manager?.getRepository(CattleDeviceHistory) ?? this.repo;
    const current = await repo.findOne({
      where: { idDevice, idTenant, unassignedAt: IsNull() },
    });
    if (current) {
      current.unassignedAt = unassignedAt ?? new Date();
      await repo.save(current);
    }
  }

  async unassignDeviceByidCattle(
    idTenant: string,
    idCattle: string,
    manager?: EntityManager,
    unassignedAt?: Date,
  ): Promise<void> {
    const repo = manager?.getRepository(CattleDeviceHistory) ?? this.repo;
    const current = await repo.findOne({
      where: { idCattle, idTenant, unassignedAt: IsNull() },
    });
    if (current) {
      current.unassignedAt = unassignedAt ?? new Date();
      await repo.save(current);
    }
  }
}

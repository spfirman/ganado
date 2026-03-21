import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { LotRepository } from '../repositories/lot.repository';
import { Lot } from '../entities/lot.entity';
import { CattleRepository } from '../../farm/repositories/cattle.repository';

@Injectable()
export class LotService {
  constructor(
    private readonly lotRepository: LotRepository,
    private readonly cattleRepository: CattleRepository,
  ) {}

  async findByPurchaseId(idPurchase: string, idTenant: string): Promise<Lot[]> {
    return this.lotRepository.findByPurchaseId(idPurchase, idTenant);
  }

  async findOne(id: string, idTenant: string): Promise<Lot> {
    const lot = await this.lotRepository.findById(id, idTenant);
    if (!lot) {
      throw new NotFoundException('Lot not found');
    }
    return lot;
  }

  async UpdateLotDataAfterReception(
    idTenant: string,
    idLot: string,
    manager: EntityManager,
  ): Promise<Lot> {
    const lot_cattle = await this.cattleRepository.findByIdLot(idTenant, idLot, manager);
    const lot = await this.lotRepository.findById(idTenant, idLot, manager);
    if (!lot) {
      throw new NotFoundException('Lot not found');
    }

    lot.receivedTotalWeight = 0;
    for (const cattle of lot_cattle) {
      lot.receivedTotalWeight += Number(cattle.receivedWeight || 0);
    }
    lot.receivedCattleCount = lot_cattle.length;

    await manager.getRepository(Lot).save(lot);
    return lot;
  }
}

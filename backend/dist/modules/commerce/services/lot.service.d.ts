import { EntityManager } from 'typeorm';
import { LotRepository } from '../repositories/lot.repository';
import { Lot } from '../entities/lot.entity';
import { CattleRepository } from '../../farm/repositories/cattle.repository';
export declare class LotService {
    private readonly lotRepository;
    private readonly cattleRepository;
    constructor(lotRepository: LotRepository, cattleRepository: CattleRepository);
    findByPurchaseId(idPurchase: string, idTenant: string): Promise<Lot[]>;
    findOne(id: string, idTenant: string): Promise<Lot>;
    UpdateLotDataAfterReception(idTenant: string, idLot: string, manager: EntityManager): Promise<Lot>;
}

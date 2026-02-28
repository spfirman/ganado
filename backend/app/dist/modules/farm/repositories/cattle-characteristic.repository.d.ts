import { DataSource, EntityManager, Repository } from 'typeorm';
import { CattleCharacteristic } from '../entities/cattle-characteristic.entity';
export declare class CattleCharacteristicRepository extends Repository<CattleCharacteristic> {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    attachMany(cattleId: string, tenantId: string, characteristicIds: string[], manager?: EntityManager): Promise<void>;
    detachMany(cattleId: string, characteristicIds: string[], manager?: EntityManager): Promise<void>;
    replaceAll(cattleId: string, tenantId: string, characteristicIds: string[], manager?: EntityManager): Promise<void>;
}

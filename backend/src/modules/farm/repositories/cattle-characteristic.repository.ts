import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { CattleCharacteristic } from '../entities/cattle-characteristic.entity';

@Injectable()
export class CattleCharacteristicRepository extends Repository<CattleCharacteristic> {
  constructor(private dataSource: DataSource) {
    super(CattleCharacteristic, dataSource.createEntityManager());
  }

  async attachMany(
    cattleId: string,
    tenantId: string,
    characteristicIds: string[],
    manager?: EntityManager,
  ): Promise<void> {
    const m = manager ?? this.manager;
    if (!characteristicIds?.length) return;
    const rows = characteristicIds.map((char) =>
      m.create(CattleCharacteristic, {
        idTenant: { id: tenantId } as any,
        cattle: { id: cattleId } as any,
        characteristic: char,
      }),
    );
    await m
      .createQueryBuilder()
      .insert()
      .into(CattleCharacteristic)
      .values(rows)
      .orIgnore()
      .execute();
  }

  async detachMany(
    cattleId: string,
    characteristicIds: string[],
    manager?: EntityManager,
  ): Promise<void> {
    const m = manager ?? this.manager;
    if (!characteristicIds?.length) return;
    await m
      .createQueryBuilder()
      .delete()
      .from(CattleCharacteristic)
      .where('id_cattle = :cattleId', { cattleId })
      .andWhere('characteristic = ANY(:ids)', { ids: characteristicIds })
      .execute();
  }

  async replaceAll(
    cattleId: string,
    tenantId: string,
    characteristicIds: string[],
    manager?: EntityManager,
  ): Promise<void> {
    const m = manager ?? this.manager;
    await m
      .createQueryBuilder()
      .delete()
      .from(CattleCharacteristic)
      .where('id_cattle = :cattleId', { cattleId })
      .execute();
    await this.attachMany(cattleId, tenantId, characteristicIds, m);
  }
}

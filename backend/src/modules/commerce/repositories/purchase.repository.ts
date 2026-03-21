import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { Purchase } from '../entities/purchase.entity';
import { PurchaseListQueryDto } from '../dto/purchase-list.query.dto';

@Injectable()
export class PurchaseRepository {
  private readonly repository: Repository<Purchase>;

  constructor(private readonly dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(Purchase);
  }

  createInstance(data: Partial<Purchase>): Purchase {
    return this.repository.create(data);
  }

  async save(purchase: Purchase): Promise<Purchase> {
    return this.repository.save(purchase);
  }

  async saveWithManager(manager: EntityManager, purchase: Partial<Purchase>): Promise<Purchase> {
    return manager.save(Purchase, purchase);
  }

  async findById(
    id: string,
    idTenant: string,
    manager?: EntityManager,
  ): Promise<Purchase | null> {
    const repo = manager?.getRepository(Purchase) ?? this.repository;
    return repo.findOne({
      where: { id, idTenant },
      relations: ['lots'],
    });
  }

  async deleteById(id: string, idTenant: string): Promise<void> {
    await this.repository.delete({ id, idTenant });
  }

  async listPaged(
    tenantId: string,
    q: PurchaseListQueryDto,
    page: number,
    limit: number,
  ): Promise<{ total: number; rows: any[] }> {
    const { from, to, provider, status = 'all' } = q;

    const qb = this.repository.createQueryBuilder('p')
      .leftJoin('providers', 'prov', 'prov.id = p.id_provider')
      .leftJoin(
        (qb1) =>
          qb1
            .subQuery()
            .select('lot.id_purchase', 'id_purchase')
            .addSelect('SUM(lot.purchased_cattle_count)', 'total_cattle')
            .addSelect('SUM(lot.total_weight)', 'total_weight')
            .addSelect('SUM(lot.received_cattle_count)', 'received_cattle_lot')
            .from('lots', 'lot')
            .groupBy('lot.id_purchase'),
        'lot_agg',
        'lot_agg.id_purchase = p.id',
      )
      .leftJoin(
        (qb2) =>
          qb2
            .subQuery()
            .select('c.id_purchase', 'id_purchase')
            .addSelect('COUNT(*)', 'received_cattle_no_lot')
            .from('cattle', 'c')
            .where('c.id_lot IS NULL')
            .groupBy('c.id_purchase'),
        'c_agg',
        'c_agg.id_purchase = p.id',
      )
      .where('p.id_tenant = :tenantId', { tenantId });

    if (from) qb.andWhere('p.purchase_date >= :from', { from });
    if (to) qb.andWhere('p.purchase_date <= :to', { to });
    if (provider) qb.andWhere('prov.name ILIKE :prov', { prov: `%${provider}%` });

    qb.select([
      'p.id AS id',
      'p.purchase_date AS "purchaseDate"',
      'prov.name AS "providerName"',
      'p.status AS "status"',
      'COALESCE(lot_agg.total_cattle, 0) AS "totalCattle"',
      'COALESCE(lot_agg.total_weight, 0) AS "totalWeight"',
      'COALESCE(lot_agg.received_cattle_lot, 0) AS "receivedCattleLot"',
      'COALESCE(c_agg.received_cattle_no_lot, 0) AS "receivedCattleNoLot"',
      '(COALESCE(lot_agg.received_cattle_lot, 0) + COALESCE(c_agg.received_cattle_no_lot, 0)) AS "receivedCattle"',
    ]);

    if (status && status !== 'all') {
      const dbStatus = status.toUpperCase();
      qb.andWhere('p.status = :dbStatus', { dbStatus });
    }

    const totalRaw = await qb
      .clone()
      .select('COUNT(DISTINCT p.id)', 'cnt')
      .offset(undefined)
      .limit(undefined)
      .orderBy()
      .getRawOne();

    const total = Number(totalRaw?.cnt ?? 0);

    qb.orderBy('p.purchase_date', 'DESC')
      .offset((page - 1) * limit)
      .limit(limit);

    const rows = await qb.getRawMany();
    return { total, rows };
  }
}

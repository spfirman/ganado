import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { PurchaseReception } from '../entities/purchase-reception.entity';

@Injectable()
export class PurchaseReceptionRepository extends Repository<PurchaseReception> {
  private readonly repository: Repository<PurchaseReception>;

  constructor(private readonly ds: DataSource) {
    super(PurchaseReception, ds.createEntityManager());
    this.repository = ds.getRepository(PurchaseReception);
  }

  findByPurchase(idTenant: string, idPurchase: string, manager?: EntityManager): Promise<PurchaseReception | null> {
    const repo = manager?.getRepository(PurchaseReception) ?? this.repository;
    var reception = repo.findOne({
      where: { idTenant, idPurchase },
    });
    return reception;
  }

  createInstance(data: Partial<PurchaseReception>, manager?: EntityManager): Promise<PurchaseReception> {
    const repo = manager?.getRepository(PurchaseReception) ?? this.repository;
    return repo.save(repo.create(data));
  }

  async insertUnique(pr: Partial<PurchaseReception>, m: EntityManager): Promise<any> {
    return m
      .createQueryBuilder()
      .insert()
      .into(PurchaseReception)
      .values(pr)
      .orIgnore()
      .returning('*')
      .execute();
  }
}

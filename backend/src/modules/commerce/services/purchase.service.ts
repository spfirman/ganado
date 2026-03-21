import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { PurchaseRepository } from '../repositories/purchase.repository';
import { LotRepository } from '../repositories/lot.repository';
import { Purchase } from '../entities/purchase.entity';
import { CreatePurchaseDto } from '../dto/create-purchase.dto';
import { UpdatePurchaseDto } from '../dto/update-purchase.dto';
import { PurchaseListQueryDto } from '../dto/purchase-list.query.dto';
import { PurchaseListItemDto } from '../dto/purchase-list.item.dto';

@Injectable()
export class PurchaseService {
  private readonly logger = new Logger(PurchaseService.name);

  constructor(
    private readonly dataSource: DataSource,
    private readonly purchaseRepository: PurchaseRepository,
    private readonly lotRepository: LotRepository,
  ) {}

  async createPurchase(
    data: CreatePurchaseDto,
    idTenant: string,
    createdBy: string,
  ): Promise<Purchase> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      var totalCattle = 0;
      var totalWeight = 0;
      if (data.lots) {
        totalCattle = data.lots.reduce((sum, lot) => sum + lot.purchasedCattleCount, 0);
        totalWeight = data.lots.reduce((sum, lot) => sum + lot.totalWeight, 0);
      }

      const purchase = this.purchaseRepository.createInstance({
        idProvider: data.idProvider,
        purchaseDate: new Date(data.purchaseDate),
        totalCattle,
        totalWeight,
        idTenant,
        idCreatedBy: createdBy,
        idUpdatedBy: createdBy,
      });
      const savedPurchase = await this.purchaseRepository.saveWithManager(
        queryRunner.manager,
        purchase,
      );

      const savedLots = [];
      for (const lotData of data.lots) {
        const lot = this.lotRepository.createInstance({
          ...lotData,
          idPurchase: savedPurchase.id,
          idTenant,
        });
        const savedLot = await this.lotRepository.saveWithManager(queryRunner.manager, lot);
        savedLots.push(savedLot);
      }

      savedPurchase.lots = savedLots;
      await queryRunner.commitTransaction();
      return savedPurchase;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async updateStatus(
    id: string,
    status: string,
    idTenant: string,
    updatedBy: string,
  ): Promise<Purchase> {
    const existing = await this.purchaseRepository.findById(id, idTenant);
    if (!existing) {
      throw new NotFoundException('Purchase not found');
    }
    existing.status = status;
    existing.idUpdatedBy = updatedBy;
    return this.purchaseRepository.save(existing);
  }

  async updatePurchase(
    id: string,
    data: UpdatePurchaseDto,
    idTenant: string,
    updatedBy: string,
  ): Promise<Purchase> {
    const existing = await this.purchaseRepository.findById(id, idTenant);
    if (!existing) {
      throw new NotFoundException('Purchase not found');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await this.lotRepository.deleteByPurchaseIdWithManager(queryRunner.manager, id, idTenant);

      var totalCattle = 0;
      var totalWeight = 0;
      if (data.lots) {
        totalCattle = data.lots.reduce((sum, lot) => sum + lot.purchasedCattleCount, 0);
        totalWeight = data.lots.reduce((sum, lot) => sum + lot.totalWeight, 0);
      }

      const savedPurchase = await this.purchaseRepository.saveWithManager(queryRunner.manager, {
        ...existing,
        idProvider: data.idProvider ? data.idProvider : existing.idProvider,
        purchaseDate: data.purchaseDate ? new Date(data.purchaseDate) : existing.purchaseDate,
        totalCattle,
        totalWeight,
        idUpdatedBy: updatedBy,
      });

      const savedLots = [];
      for (const lotData of data.lots || []) {
        const lot = this.lotRepository.createInstance({
          ...lotData,
          idPurchase: savedPurchase.id,
          idTenant,
        });
        const savedLot = await this.lotRepository.saveWithManager(queryRunner.manager, lot);
        savedLots.push(savedLot);
      }

      savedPurchase.lots = savedLots;
      await queryRunner.commitTransaction();
      return savedPurchase;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async findById(id: string, idTenant: string): Promise<Purchase> {
    const purchase = await this.purchaseRepository.findById(id, idTenant);
    if (!purchase) {
      throw new NotFoundException('Purchase not found');
    }
    purchase.lots = await this.lotRepository.findByPurchaseId(id, idTenant);
    return purchase;
  }

  async findAll(idTenant: string): Promise<Purchase[]> {
    return this.dataSource.getRepository(Purchase).find({
      where: { idTenant },
      relations: ['lots'],
      order: { purchaseDate: 'DESC' },
    });
  }

  async deleteById(id: string, idTenant: string): Promise<void> {
    const existing = await this.purchaseRepository.findById(id, idTenant);
    if (!existing) {
      throw new NotFoundException('Purchase not found');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await this.lotRepository.deleteByPurchaseIdWithManager(queryRunner.manager, id, idTenant);
      await this.purchaseRepository.deleteById(id, idTenant);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async listPaged(
    tenantId: string,
    q: PurchaseListQueryDto,
  ): Promise<{ page: number; limit: number; total: number; items: PurchaseListItemDto[] }> {
    const page = Math.max(1, q.page ?? 1);
    const limit = Math.max(1, q.limit ?? 10);
    const { total, rows } = await this.purchaseRepository.listPaged(tenantId, q, page, limit);

    const items: PurchaseListItemDto[] = rows.map((r: any) => ({
      id: r.id,
      purchaseDate: new Date(r.purchaseDate).toISOString(),
      providerName: r.providerName ?? null,
      totalCattle: Number(r.totalCattle ?? 0),
      totalWeight: Number(r.totalWeight ?? 0),
      receivedCattle: Number(r.receivedCattle ?? 0),
      receivedWeight: Number(r.receivedWeight ?? 0),
      status: r.status,
    }));

    return { page, limit, total, items };
  }
}

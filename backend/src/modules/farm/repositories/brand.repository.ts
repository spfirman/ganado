import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, EntityManager } from 'typeorm';
import { Brand } from '../entities/brand.entity';
import { v4 } from 'uuid';

@Injectable()
export class BrandRepository {
  constructor(
    @InjectRepository(Brand)
    private readonly repo: Repository<Brand>,
  ) {}

  async create(dto: Partial<Brand>): Promise<Brand> {
    if (!('id' in dto) || dto.id == null || dto.id == undefined) {
      dto.id = v4();
    }
    const entity = this.repo.create(dto);
    return await this.repo.save(entity);
  }

  async createWithManager(dto: Partial<Brand>, manager: EntityManager): Promise<Brand> {
    if (!('id' in dto) || dto.id == null || dto.id == undefined) {
      dto.id = v4();
    }
    const entity = manager.create(Brand, dto);
    return await manager.save(entity);
  }

  async findAll(idTenant: string): Promise<Brand[]> {
    return await this.repo.find({
      where: { idTenant },
      order: { name: 'ASC' },
    });
  }

  async findOne(idTenant: string, id: string, manager?: EntityManager): Promise<Brand | null> {
    const repo = manager?.getRepository(Brand) ?? this.repo;
    return await repo.findOne({
      where: { idTenant, id },
      select: ['id', 'idTenant', 'name', 'createdAt', 'updatedAt', 'image'],
    });
  }

  async findByName(idTenant: string, name: string, manager?: EntityManager): Promise<Brand | null> {
    const repo = manager?.getRepository(Brand) ?? this.repo;
    return await repo.findOne({ where: { idTenant, name: ILike(name) } });
  }

  async update(
    idTenant: string,
    id: string,
    dto: Partial<Brand>,
    imageFile?: Express.Multer.File,
    manager?: EntityManager,
  ): Promise<Brand | null> {
    const repo = manager?.getRepository(Brand) ?? this.repo;
    const existing = await repo.findOne({ where: { idTenant, id } });
    if (!existing) return null;
    Object.assign(existing, dto);
    if (imageFile) {
      existing.image = imageFile.buffer;
      existing.imageMimeType = imageFile.mimetype;
    }
    return await repo.save(existing);
  }

  async delete(idTenant: string, id: string, manager?: EntityManager): Promise<void> {
    const repo = manager?.getRepository(Brand) ?? this.repo;
    await repo.delete({ idTenant, id });
  }
}

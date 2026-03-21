import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { BrandRepository } from '../repositories/brand.repository';
import { CreateBrandDto } from '../dto/create-brand.dto';
import { UpdateBrandDto } from '../dto/update-brand.dto';
import { Brand } from '../entities/brand.entity';
import { SyncBrandDto } from '../dto/sync-brand.dto';

@Injectable()
export class BrandService {
  constructor(
    private readonly brandRepository: BrandRepository,
    private readonly dataSource: DataSource,
  ) {}

  async create(
    idTenant: string,
    dto: CreateBrandDto,
    imageFile: Express.Multer.File,
  ): Promise<Brand> {
    if (!dto.name) {
      throw new BadRequestException('Faltan datos obligatorios: name o idTenant');
    }
    const existing = await this.brandRepository.findByName(idTenant, dto.name);
    if (existing) {
      throw new ConflictException('Ya existe una marca con ese nombre');
    }
    const brand: Partial<Brand> = {
      id: dto.id,
      idTenant,
      name: dto.name,
      image: imageFile.buffer,
      imageMimeType: imageFile.mimetype,
    };
    return await this.brandRepository.create(brand);
  }

  async findAll(idTenant: string): Promise<Brand[]> {
    return await this.brandRepository.findAll(idTenant);
  }

  async findByIdOrFail(
    idTenant: string,
    id: string,
    manager?: EntityManager,
  ): Promise<Brand> {
    const brand = await this.brandRepository.findOne(idTenant, id, manager);
    if (!brand) throw new NotFoundException(`Brand ${id} not found`);
    return brand;
  }

  async update(
    idTenant: string,
    id: string,
    dto: UpdateBrandDto,
    imageFile?: Express.Multer.File,
  ): Promise<Brand> {
    const updated = await this.brandRepository.update(idTenant, id, dto, imageFile);
    if (!updated) {
      throw new NotFoundException(`Brand ${id} not found`);
    }
    return updated;
  }

  async remove(idTenant: string, id: string): Promise<void> {
    await this.brandRepository.delete(idTenant, id);
  }

  async createWithTransaction(
    idTenant: string,
    dto: Partial<Brand>,
  ): Promise<Brand> {
    return await this.dataSource.transaction(async (manager) => {
      if (!dto.name) {
        throw new BadRequestException('Faltan datos obligatorios: name o idTenant');
      }
      const existing = await this.brandRepository.findByName(
        idTenant,
        dto.name,
        manager,
      );
      if (existing) {
        throw new ConflictException('Ya existe una marca con ese nombre');
      }
      const fullDto = {
        ...dto,
        idTenant,
      };
      return await this.brandRepository.createWithManager(fullDto, manager);
    });
  }

  async syncBrands(
    idTenant: string,
    brands: SyncBrandDto[],
    filesMap: Map<string, Express.Multer.File>,
  ): Promise<any[]> {
    const results: any[] = [];
    for (const b of brands) {
      try {
        const existing = await this.brandRepository.findByName(idTenant, b.name);
        if (existing) {
          results.push({ id: b.id, status: 'synced', serverId: existing.id });
          continue;
        }
        const imageField = `image_${b.id.replace(/-/g, '_')}`;
        const imageFile = filesMap.get(imageField);
        if (!imageFile || imageFile.size === 0) {
          throw new Error(`Image didn't found for brand '${b.name}'`);
        }
        const brand = await this.brandRepository.create({
          id: b.id,
          idTenant,
          name: b.name,
          image: imageFile.buffer,
          imageMimeType: imageFile.mimetype,
        });
        results.push({ id: b.id, status: 'synced', serverId: brand.id });
      } catch (error) {
        results.push({ id: b.id, status: 'failed', message: error.message });
      }
    }
    return results;
  }
}

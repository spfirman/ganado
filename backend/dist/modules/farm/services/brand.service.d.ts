import { DataSource, EntityManager } from 'typeorm';
import { BrandRepository } from '../repositories/brand.repository';
import { CreateBrandDto } from '../dto/create-brand.dto';
import { UpdateBrandDto } from '../dto/update-brand.dto';
import { Brand } from '../entities/brand.entity';
import { SyncBrandDto } from '../dto/sync-brand.dto';
export declare class BrandService {
    private readonly brandRepository;
    private readonly dataSource;
    constructor(brandRepository: BrandRepository, dataSource: DataSource);
    create(idTenant: string, dto: CreateBrandDto, imageFile: Express.Multer.File): Promise<Brand>;
    findAll(idTenant: string): Promise<Brand[]>;
    findByIdOrFail(idTenant: string, id: string, manager?: EntityManager): Promise<Brand>;
    update(idTenant: string, id: string, dto: UpdateBrandDto, imageFile?: Express.Multer.File): Promise<Brand>;
    remove(idTenant: string, id: string): Promise<void>;
    createWithTransaction(idTenant: string, dto: Partial<Brand>): Promise<Brand>;
    syncBrands(idTenant: string, brands: SyncBrandDto[], filesMap: Map<string, Express.Multer.File>): Promise<any[]>;
}

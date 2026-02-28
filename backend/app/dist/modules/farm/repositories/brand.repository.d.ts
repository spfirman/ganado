import { Repository, EntityManager } from 'typeorm';
import { Brand } from '../entities/brand.entity';
import { CreateBrandDto } from '../dto/create-brand.dto';
import { UpdateBrandDto } from '../dto/update-brand.dto';
export declare class BrandRepository {
    private readonly repo;
    constructor(repo: Repository<Brand>);
    create(dto: Partial<Brand>): Promise<Brand>;
    createWithManager(dto: CreateBrandDto, manager: EntityManager): Promise<Brand>;
    findAll(idTenant: string): Promise<Brand[]>;
    findOne(idTenant: string, id: string, manager?: EntityManager): Promise<Brand | null>;
    findByName(idTenant: string, name: string, manager?: EntityManager): Promise<Brand | null>;
    update(idTenant: string, id: string, dto: UpdateBrandDto, imageFile?: Express.Multer.File, manager?: EntityManager): Promise<Brand | null>;
    delete(idTenant: string, id: string, manager?: EntityManager): Promise<void>;
}

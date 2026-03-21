import { Repository, EntityManager } from 'typeorm';
import { ModuleEntity } from '../entities/module.entity';
export declare class ModulesService {
    private moduleRepository;
    constructor(moduleRepository: Repository<ModuleEntity>);
    findAll(manager?: EntityManager): Promise<ModuleEntity[]>;
    findByName(name: string, manager?: EntityManager): Promise<ModuleEntity>;
    findById(id: string, manager?: EntityManager): Promise<ModuleEntity>;
}

import { Repository } from 'typeorm';
import { ModuleEntity } from '../entities/module.entity';
import { EntityManager } from 'typeorm';
export declare class ModulesService {
    private readonly moduleRepository;
    constructor(moduleRepository: Repository<ModuleEntity>);
    findAll(manager?: EntityManager): Promise<ModuleEntity[]>;
    findByName(name: string, manager?: EntityManager): Promise<ModuleEntity>;
    findById(id: string, manager?: EntityManager): Promise<ModuleEntity>;
}

import { Repository, EntityManager } from 'typeorm';
import { Device } from '../entities/device.entity';
export declare class DeviceRepository {
    private readonly repository;
    constructor(repository: Repository<Device>);
    create(createDeviceDto: Partial<Device>): Promise<Device>;
    findAll(idTenant: string): Promise<Device[]>;
    findOne(id: string): Promise<Device>;
    findByIdAndTenantId(id: string, idTenant: string, manager?: EntityManager): Promise<Device>;
    findByDevEuiAndTenantId(deveui: string, idTenant: string, manager?: EntityManager): Promise<Device>;
    update(id: string, updateDeviceDto: Partial<Device>, manager?: EntityManager): Promise<Device>;
    remove(id: string): Promise<void>;
}

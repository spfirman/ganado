import { EntityManager, Repository } from 'typeorm';
import { Device } from '../entities/device.entity';
import { CreateDeviceDto } from '../dto/create-device.dto';
import { UpdateDeviceDto } from '../dto/update-device.dto';
export declare class DeviceRepository {
    private readonly repository;
    constructor(repository: Repository<Device>);
    create(createDeviceDto: CreateDeviceDto): Promise<Device>;
    findAll(idTenant: string): Promise<Device[]>;
    findOne(id: string): Promise<Device>;
    findByIdAndTenantId(id: string, idTenant: string, manager?: EntityManager): Promise<Device>;
    findByDevEuiAndTenantId(deveui: string, idTenant: string, manager?: EntityManager): Promise<Device>;
    update(id: string, updateDeviceDto: UpdateDeviceDto, manager?: EntityManager): Promise<Device | null>;
    remove(id: string): Promise<void>;
}

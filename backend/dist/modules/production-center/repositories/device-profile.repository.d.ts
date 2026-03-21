import { Repository } from 'typeorm';
import { DeviceProfile } from '../entities/device-profile.entity';
export declare class DeviceProfileRepository {
    private readonly repository;
    constructor(repository: Repository<DeviceProfile>);
    create(createDeviceProfileDto: Partial<DeviceProfile>): Promise<DeviceProfile>;
    findAll(idTenant: string): Promise<DeviceProfile[]>;
    findOne(id: string, idTenant: string): Promise<DeviceProfile>;
    findByNameAndTenantId(name: string, idTenant: string): Promise<DeviceProfile>;
    update(id: string, updateDeviceProfileDto: Partial<DeviceProfile>): Promise<DeviceProfile>;
    remove(id: string): Promise<void>;
}

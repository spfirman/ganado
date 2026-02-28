import { Repository } from 'typeorm';
import { DeviceProfile } from '../entities/device-profile.entity';
import { CreateDeviceProfileDto } from '../dto/create-device-profile.dto';
import { UpdateDeviceProfileDto } from '../dto/update-device-profile.dto';
export declare class DeviceProfileRepository {
    private readonly repository;
    constructor(repository: Repository<DeviceProfile>);
    create(createDeviceProfileDto: CreateDeviceProfileDto): Promise<DeviceProfile>;
    findAll(idTenant: string): Promise<DeviceProfile[]>;
    findOne(id: string, idTenant: string): Promise<DeviceProfile>;
    findByNameAndTenantId(name: string, idTenant: string): Promise<DeviceProfile>;
    update(id: string, updateDeviceProfileDto: UpdateDeviceProfileDto): Promise<DeviceProfile>;
    remove(id: string): Promise<void>;
}

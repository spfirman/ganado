import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeviceProfile } from '../entities/device-profile.entity';

@Injectable()
export class DeviceProfileRepository {
  constructor(
    @InjectRepository(DeviceProfile)
    private readonly repository: Repository<DeviceProfile>,
  ) {}

  async create(createDeviceProfileDto: Partial<DeviceProfile>): Promise<DeviceProfile> {
    const deviceProfile = this.repository.create(createDeviceProfileDto);
    return await this.repository.save(deviceProfile);
  }

  async findAll(idTenant: string): Promise<DeviceProfile[]> {
    return await this.repository.find({ where: { idTenant: idTenant } });
  }

  async findOne(id: string, idTenant: string): Promise<DeviceProfile> {
    const deviceProfile = await this.repository.findOne({ where: { id, idTenant: idTenant } });
    if (!deviceProfile) {
      throw new NotFoundException(`Device profile with ID ${id} not found`);
    }
    return deviceProfile;
  }

  async findByNameAndTenantId(name: string, idTenant: string): Promise<DeviceProfile> {
    const deviceProfile = await this.repository.findOne({ where: { name, idTenant: idTenant } });
    if (!deviceProfile) {
      throw new NotFoundException(`Device profile with name ${name} not found`);
    }
    return deviceProfile;
  }

  async update(id: string, updateDeviceProfileDto: Partial<DeviceProfile>): Promise<DeviceProfile> {
    await this.repository.update(id, updateDeviceProfileDto);
    return await this.findOne(id, updateDeviceProfileDto.idTenant);
  }

  async remove(id: string): Promise<void> {
    const result = await this.repository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Device profile with ID ${id} not found`);
    }
  }
}

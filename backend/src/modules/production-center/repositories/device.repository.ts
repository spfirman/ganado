import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { Device } from '../entities/device.entity';

@Injectable()
export class DeviceRepository {
  constructor(
    @InjectRepository(Device)
    private readonly repository: Repository<Device>,
  ) {}

  async create(createDeviceDto: Partial<Device>): Promise<Device> {
    const device = this.repository.create(createDeviceDto);
    return await this.repository.save(device);
  }

  async findAll(idTenant: string): Promise<Device[]> {
    return await this.repository.find({ where: { idTenant } });
  }

  async findOne(id: string): Promise<Device> {
    const device = await this.repository.findOne({ where: { id } });
    if (!device) {
      throw new NotFoundException(`Device with ID ${id} not found`);
    }
    return device;
  }

  async findByIdAndTenantId(id: string, idTenant: string, manager?: EntityManager): Promise<Device> {
    const repo = manager ? manager.getRepository(Device) : this.repository;
    const device = await repo.findOne({ where: { id, idTenant } });
    if (!device) {
      throw new NotFoundException(`Device with ID ${id} not found`);
    }
    return device;
  }

  async findByDevEuiAndTenantId(deveui: string, idTenant: string, manager?: EntityManager): Promise<Device> {
    const repo = manager ? manager.getRepository(Device) : this.repository;
    const device = await repo.findOne({ where: { deveui, idTenant } });
    if (!device) {
      throw new NotFoundException(`Device with DevEUI ${deveui} not found`);
    }
    return device;
  }

  async update(id: string, updateDeviceDto: Partial<Device>, manager?: EntityManager): Promise<Device> {
    const repo = manager ? manager.getRepository(Device) : this.repository;
    await repo.update(id, updateDeviceDto);
    return await repo.findOne({ where: { id } });
  }

  async remove(id: string): Promise<void> {
    const result = await this.repository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Device with ID ${id} not found`);
    }
  }
}

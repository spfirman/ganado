import { Repository, DataSource } from 'typeorm';
import { Location } from '../entities/location.entity';
import { Injectable } from '@nestjs/common';
import { CreateLocationDto } from '../dto/create-location.dto';

@Injectable()
export class LocationRepository extends Repository<Location> {
  constructor(private dataSource: DataSource) {
    super(Location, dataSource.createEntityManager());
  }

  async findLatestByDevice(deviceId: string, idTenant: string): Promise<Location | null> {
    return this.createQueryBuilder('location')
      .where('location.id_device = :deviceId', { deviceId })
      .andWhere('location.id_tenant = :idTenant', { idTenant })
      .orderBy('location.created_at', 'DESC')
      .getOne();
  }

  async findLatestByCattle(cattleId: string, idTenant: string): Promise<Location | null> {
    return this.createQueryBuilder('location')
      .where('location.id_cattle = :cattleId', { cattleId })
      .andWhere('location.id_tenant = :idTenant', { idTenant })
      .orderBy('location.created_at', 'DESC')
      .getOne();
  }

  async createLocation(locationDto: CreateLocationDto): Promise<Location> {
    const location = this.create(locationDto);
    return this.save(location);
  }
}

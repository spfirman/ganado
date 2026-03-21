import { Injectable, Logger } from '@nestjs/common';
import { LocationRepository } from '../repositories/location.repository';
import { CreateLocationDto } from '../dto/create-location.dto';
import { Location } from '../entities/location.entity';

@Injectable()
export class LocationService {
  private readonly logger: Logger;

  constructor(private readonly locationRepository: LocationRepository) {
    this.logger = new Logger(LocationService.name);
  }

  async create(data: CreateLocationDto): Promise<Location> {
    const location = await this.locationRepository.createLocation(data);
    if (location) {
      this.logger.log(`Location created: ${location.id}`, location);
    }
    return location;
  }

  findByCattle(idCattle: string, idTenant: string): Promise<Location | null> {
    return this.locationRepository.findLatestByCattle(idCattle, idTenant);
  }

  findByDevice(idDevice: string, idTenant: string): Promise<Location | null> {
    return this.locationRepository.findLatestByDevice(idDevice, idTenant);
  }

  findOne(id: string): Promise<Location | null> {
    return this.locationRepository.findOne({
      where: { id },
    });
  }

  remove(id: string) {
    return this.locationRepository.delete(id);
  }
}

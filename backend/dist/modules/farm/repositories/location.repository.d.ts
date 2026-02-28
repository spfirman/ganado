import { Repository } from 'typeorm';
import { Location } from '../entities/location.entity';
import { DataSource } from 'typeorm';
import { CreateLocationDto } from '../dto/create-location.dto';
export declare class LocationRepository extends Repository<Location> {
    private dataSource;
    constructor(dataSource: DataSource);
    findLatestByDevice(deviceId: string, idTenant: string): Promise<Location | null>;
    findLatestByCattle(cattleId: string, idTenant: string): Promise<Location | null>;
    createLocation(locationDto: CreateLocationDto): Promise<Location>;
}

import { LocationRepository } from '../repositories/location.repository';
import { CreateLocationDto } from '../dto/create-location.dto';
import { Location } from '../entities/location.entity';
export declare class LocationService {
    private readonly locationRepository;
    private readonly logger;
    constructor(locationRepository: LocationRepository);
    create(data: CreateLocationDto): Promise<Location>;
    findByCattle(idCattle: string, idTenant: string): Promise<Location | null>;
    findByDevice(idDevice: string, idTenant: string): Promise<Location | null>;
    findOne(id: string): Promise<Location | null>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
}

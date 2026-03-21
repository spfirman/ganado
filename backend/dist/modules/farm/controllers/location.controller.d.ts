import { LocationService } from '../services/location.service';
import { Location } from '../entities/location.entity';
import { SessionUserDto } from '../../auth/dto/session-user.dto';
export declare class LocationController {
    private readonly locationService;
    constructor(locationService: LocationService);
    findOne(id: string): Promise<Location>;
    findByCattle(id: string, sessionUser: SessionUserDto): Promise<Location>;
    findByDevice(id: string, sessionUser: SessionUserDto): Promise<Location>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
}

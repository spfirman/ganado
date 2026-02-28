import { LocationService } from '../services/location.service';
import { Location } from '../entities/location.entity';
import { SessionUserDto } from 'src/modules/auth/dto/session-user.dto';
export declare class LocationController {
    private readonly locationService;
    constructor(locationService: LocationService);
    findOne(id: string): Promise<Location | null>;
    findByCattle(id: string, sessionUser: SessionUserDto): Promise<Location | null>;
    findByDevice(id: string, sessionUser: SessionUserDto): Promise<Location | null>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
}

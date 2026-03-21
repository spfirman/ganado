import { DeviceProfilesService } from '../services/device-profiles.service';
import { CreateDeviceProfileDto } from '../dto/create-device-profile.dto';
import { UpdateDeviceProfileDto } from '../dto/update-device-profile.dto';
import { SessionUserDto } from '../../auth/dto/session-user.dto';
export declare class DeviceProfilesController {
    private readonly deviceProfilesService;
    constructor(deviceProfilesService: DeviceProfilesService);
    create(sessionUser: SessionUserDto, createDeviceProfileDto: CreateDeviceProfileDto): Promise<any>;
    findAll(sessionUser: SessionUserDto): Promise<any>;
    findOne(id: string, sessionUser: SessionUserDto): Promise<any>;
    update(id: string, sessionUser: SessionUserDto, updateDeviceProfileDto: UpdateDeviceProfileDto): Promise<any>;
    remove(id: string, sessionUser: SessionUserDto): Promise<void>;
}

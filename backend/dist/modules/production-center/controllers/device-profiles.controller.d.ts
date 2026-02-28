import { DeviceProfilesService } from '../services/device-profiles.service';
import { CreateDeviceProfileDto } from '../dto/create-device-profile.dto';
import { UpdateDeviceProfileDto } from '../dto/update-device-profile.dto';
import { DeviceProfileResponseDto } from '../dto/device-profile-response.dto';
import { SessionUserDto } from '../../auth/dto/session-user.dto';
export declare class DeviceProfilesController {
    private readonly deviceProfilesService;
    constructor(deviceProfilesService: DeviceProfilesService);
    create(sessionUser: SessionUserDto, createDeviceProfileDto: CreateDeviceProfileDto): Promise<DeviceProfileResponseDto>;
    findAll(sessionUser: SessionUserDto): Promise<DeviceProfileResponseDto[]>;
    findOne(id: string, sessionUser: SessionUserDto): Promise<DeviceProfileResponseDto>;
    update(id: string, sessionUser: SessionUserDto, updateDeviceProfileDto: UpdateDeviceProfileDto): Promise<DeviceProfileResponseDto>;
    remove(id: string, sessionUser: SessionUserDto): Promise<void>;
}

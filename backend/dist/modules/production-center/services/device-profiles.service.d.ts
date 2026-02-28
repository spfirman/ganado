import { DeviceProfileRepository } from '../repositories/device-profile.repository';
import { CreateDeviceProfileDto } from '../dto/create-device-profile.dto';
import { UpdateDeviceProfileDto } from '../dto/update-device-profile.dto';
import { DeviceProfile } from '../entities/device-profile.entity';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { DevicesService } from './devices.service';
export declare class DeviceProfilesService {
    private readonly deviceProfileRepository;
    private readonly httpService;
    private readonly configService;
    private readonly devicesService;
    private readonly chirpstackUrl;
    private readonly chirpstackToken;
    private readonly logger;
    constructor(deviceProfileRepository: DeviceProfileRepository, httpService: HttpService, configService: ConfigService, devicesService: DevicesService);
    create(createDeviceProfileDto: CreateDeviceProfileDto): Promise<DeviceProfile>;
    private validateChirpstackDeviceProfile;
    findAll(idTenant: string): Promise<DeviceProfile[]>;
    findOne(id: string, idTenant: string): Promise<DeviceProfile>;
    update(id: string, idTenant: string, updateDeviceProfileDto: UpdateDeviceProfileDto): Promise<DeviceProfile>;
    remove(id: string, idTenant: string): Promise<void>;
}

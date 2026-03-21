import { DeviceProfileRepository } from '../repositories/device-profile.repository';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { DevicesService } from './devices.service';
import { DeviceProfile } from '../entities/device-profile.entity';
import { CreateDeviceProfileDto } from '../dto/create-device-profile.dto';
import { UpdateDeviceProfileDto } from '../dto/update-device-profile.dto';
export declare class DeviceProfilesService {
    private readonly deviceProfileRepository;
    private readonly httpService;
    private readonly configService;
    private readonly devicesService;
    private chirpstackUrl;
    private chirpstackToken;
    private readonly logger;
    constructor(deviceProfileRepository: DeviceProfileRepository, httpService: HttpService, configService: ConfigService, devicesService: DevicesService);
    create(createDeviceProfileDto: CreateDeviceProfileDto): Promise<DeviceProfile>;
    validateChirpstackDeviceProfile(idChipstack: string): Promise<any>;
    findAll(idTenant: string): Promise<DeviceProfile[]>;
    findOne(id: string, idTenant: string): Promise<DeviceProfile>;
    update(id: string, idTenant: string, updateDeviceProfileDto: UpdateDeviceProfileDto): Promise<DeviceProfile>;
    remove(id: string, idTenant: string): Promise<void>;
}

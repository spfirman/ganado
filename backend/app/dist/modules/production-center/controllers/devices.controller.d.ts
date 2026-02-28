import { DevicesService } from '../services/devices.service';
import { CreateDeviceDto } from '../dto/create-device.dto';
import { UpdateDeviceDto } from '../dto/update-device.dto';
import { DeviceResponseDto } from '../dto/device-response.dto';
import { SessionUserDto } from 'src/modules/auth/dto/session-user.dto';
export declare class DevicesController {
    private readonly deviceService;
    constructor(deviceService: DevicesService);
    create(sessionUser: SessionUserDto, createDeviceDto: CreateDeviceDto): Promise<DeviceResponseDto>;
    findOne(deveui: string, sessionUser: SessionUserDto): Promise<DeviceResponseDto>;
    update(deveui: string, sessionUser: SessionUserDto, updateDeviceDto: UpdateDeviceDto): Promise<DeviceResponseDto>;
    remove(id: string, sessionUser: SessionUserDto): Promise<void>;
    list(sessionUser: SessionUserDto): Promise<DeviceResponseDto[]>;
    importarExcel(file: Express.Multer.File, body: {
        deviceProfileId: string;
    }, sessionUser: SessionUserDto): Promise<any[]>;
}

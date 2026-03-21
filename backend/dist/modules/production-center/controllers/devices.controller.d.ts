import { DevicesService } from '../services/devices.service';
import { CreateDeviceDto } from '../dto/create-device.dto';
import { UpdateDeviceDto } from '../dto/update-device.dto';
import { SessionUserDto } from '../../auth/dto/session-user.dto';
export declare class DevicesController {
    private readonly deviceService;
    constructor(deviceService: DevicesService);
    create(sessionUser: SessionUserDto, createDeviceDto: CreateDeviceDto): Promise<any>;
    findOne(deveui: string, sessionUser: SessionUserDto): Promise<any>;
    update(deveui: string, sessionUser: SessionUserDto, updateDeviceDto: UpdateDeviceDto): Promise<any>;
    remove(id: string, sessionUser: SessionUserDto): Promise<void>;
    list(sessionUser: SessionUserDto): Promise<any>;
    importarExcel(file: any, body: any, sessionUser: SessionUserDto): Promise<any>;
}

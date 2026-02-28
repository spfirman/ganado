import { DeviceProfile } from './device-profile.entity';
export declare class Device {
    id: string;
    deveui: string;
    idTenant: string;
    idDeviceProfile: string;
    name: string;
    description: string;
    tags: Record<string, any>;
    variables: Record<string, any>;
    idChirpstackProfile: string;
    csApplicationId: string;
    csJoineui: string;
    csAppKey: string;
    csNwkKey: string;
    batteryStatus: string;
    batteryUpdate: Date;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    deviceProfile: DeviceProfile;
}

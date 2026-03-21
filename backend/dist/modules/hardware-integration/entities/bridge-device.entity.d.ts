import { BridgeDeviceType, BridgeDeviceStatus } from '../enums/weighing-source.enum';
export declare class BridgeDevice {
    id: string;
    idTenant: string;
    name: string;
    type: BridgeDeviceType;
    ipAddress: string | null;
    status: BridgeDeviceStatus;
    lastSeenAt: Date | null;
    configJson: Record<string, any>;
    apiKey: string | null;
    createdAt: Date;
    updatedAt: Date;
}

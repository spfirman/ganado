import { BridgeDeviceType } from '../enums/weighing-source.enum';
export declare class RegisterDeviceDto {
    name: string;
    type: BridgeDeviceType;
    ipAddress?: string;
    configJson?: Record<string, any>;
}
export declare class DeviceHeartbeatDto {
    statusDetails?: Record<string, any>;
}
export declare class BridgeStatusResponseDto {
    deviceId: string;
    status: string;
    lastSeenAt: Date;
    pollIntervalMs?: number;
    cameraSettings?: Record<string, any>;
    scaleSettings?: Record<string, any>;
}

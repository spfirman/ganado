export interface ChirpstackDeviceInterface {
    applicationId: string;
    description?: string;
    devEui: string;
    deviceProfileId: string;
    isDisabled: boolean;
    joinEui: string;
    name: string;
    skipFcntCheck: boolean;
    tags?: Record<string, string>;
    variables?: Record<string, string>;
}
export interface ChirpstackDeviceKeysInterface {
    appKey: string;
    nwkKey: string;
}
export interface ChirpstackDeviceUpdateInterface {
    applicationId?: string;
    description?: string;
    devEui?: string;
    deviceProfileId?: string;
    isDisabled?: boolean;
    joinEui?: string;
    name?: string;
    skipFcntCheck?: boolean;
    tags?: Record<string, string>;
    variables?: Record<string, string>;
}
export interface ChirpstackDeviceKeysUpdateInterface {
    appKey?: string;
    nwkKey?: string;
}

export interface ChirpstackDevice {
  applicationId?: string;
  description?: string;
  devEui?: string;
  deviceProfileId?: string;
  isDisabled?: boolean;
  joinEui?: string;
  name?: string;
  skipFcntCheck?: boolean;
  tags?: Record<string, any>;
  variables?: Record<string, any>;
}

export interface ChirpstackDeviceKeys {
  appKey?: string;
  nwkKey?: string;
}

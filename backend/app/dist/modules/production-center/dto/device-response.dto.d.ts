export declare class DeviceResponseDto {
    id: string;
    idDeviceProfile: string;
    deveui: string;
    name: string;
    description: string;
    csApplicationId: string;
    csJoineui: string;
    csAppKey: string;
    csNwkKey: string;
    tags: Record<string, any>;
    variables: Record<string, any>;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

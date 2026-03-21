export declare class UpdateDeviceDto {
    deveui: string;
    idDeviceProfile: string;
    name: string;
    description: string;
    csApplicationId: string;
    csJoineui: string;
    csAppKey: string;
    csNwkKey: string;
    tags: Record<string, any>;
    variables: Record<string, any>;
    isActive: boolean;
    updatedAt: Date;
}

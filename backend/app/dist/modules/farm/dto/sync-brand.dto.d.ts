export declare class SyncBrandDto {
    id: string;
    idTenant: string;
    name: string;
    image: any;
    static parseAndValidateBrands(brandsJson: string): Promise<SyncBrandDto[]>;
}
export declare class SyncBrandRequestDto {
    brands: SyncBrandDto[];
}
export declare class SyncBrandResultDto {
    id: string;
    status: string;
    serverId?: string;
    message?: string;
}
export declare class SyncBrandResponseDto {
    results: SyncBrandResultDto[];
}

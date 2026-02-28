import { Brand } from '../entities/brand.entity';
export declare class BrandResponseDto {
    id: string;
    name: string;
    idTenant: string;
    createdAt: Date;
    updatedAt: Date;
    imageMimeType: string;
    imageBase64?: string;
    static toResponseDto(brand: Brand): BrandResponseDto;
}

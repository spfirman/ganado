import { ApiProperty } from '@nestjs/swagger';
import { Brand } from '../entities/brand.entity';

export class BrandResponseDto {
  @ApiProperty({ example: 'uuid-de-la-marca', description: 'Unique ID of the brand' })
  id: string;

  @ApiProperty({ example: 'Marca A', description: 'Name of the brand' })
  name: string;

  @ApiProperty({ example: 'tenant-uuid', description: 'Tenant identifier' })
  idTenant: string;

  @ApiProperty({ example: '2025-07-24T12:00:00Z', description: 'Creation date' })
  createdAt: Date;

  @ApiProperty({ example: '2025-07-24T12:00:00Z', description: 'Last update date' })
  updatedAt: Date;

  @ApiProperty({ example: 'image/png', description: 'Type of image, e.g. image/jpg' })
  imageMimeType: string;

  @ApiProperty({
    example: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...',
    description: 'Brand image encoded in base64 (data URL)',
    required: false,
  })
  imageBase64: string;

  static toResponseDto(brand: Brand): BrandResponseDto {
    const mime = brand.imageMimeType;
    const base64 = `data:${mime};base64,${brand.image.toString('base64')}`;
    return {
      imageMimeType: brand.imageMimeType,
      imageBase64: base64,
      id: brand.id,
      idTenant: brand.idTenant,
      name: brand.name,
      createdAt: brand.createdAt,
      updatedAt: brand.updatedAt,
    };
  }
}

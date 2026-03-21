import { ApiProperty } from '@nestjs/swagger';
import { ProviderType } from '../entities/provider.entity';
import { Provider } from '../entities/provider.entity';

export class ProviderResponseDto {
  @ApiProperty({ example: 'c3d1e10b-feb3-48f9-a19c-6f95e7f416bc' })
  id: string;

  @ApiProperty({ example: 'Ganaderia El Porvenir' })
  name: string;

  @ApiProperty({ example: '900123456-7' })
  nit: string;

  @ApiProperty({ example: 'BUYER', enum: ProviderType })
  type: string;

  @ApiProperty({ example: '2025-07-03T18:00:00.000Z' })
  created_at: Date;

  @ApiProperty({ example: '2025-07-04T10:32:00.000Z' })
  updated_at: Date;

  static toProviderResponse(provider: Provider): ProviderResponseDto {
    return {
      id: provider.id,
      name: provider.name,
      nit: provider.nit,
      type: provider.type,
      created_at: provider.created_at,
      updated_at: provider.updated_at,
    };
  }
}

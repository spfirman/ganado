import { ApiProperty } from '@nestjs/swagger';
import { BadRequestException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

export class SyncBrandDto {
  @ApiProperty({ example: 'uuid-local-brand' })
  id: string;

  @ApiProperty({ example: 'tenant-uuid' })
  idTenant: string;

  @ApiProperty({ example: 'Marca X' })
  name: string;

  @ApiProperty({ type: 'string', format: 'binary', required: true })
  image: any;

  static async parseAndValidateBrands(brandsJson: string): Promise<SyncBrandDto[]> {
    let parsed: any;
    try {
      parsed = JSON.parse(brandsJson);
    } catch (err) {
      throw new BadRequestException('Invalid formt for brands.');
    }
    if (!Array.isArray(parsed)) {
      throw new BadRequestException('Field must be fixed.');
    }
    const brandDtos = plainToInstance(SyncBrandDto, parsed);
    for (const [index, dto] of brandDtos.entries()) {
      const errors = await validate(dto);
      if (errors.length > 0) {
        throw new BadRequestException({
          message: `Error de validación en brands[${index}]`,
          errors: errors.map((e) => ({
            property: e.property,
            constraints: e.constraints,
          })),
        });
      }
    }
    return brandDtos;
  }
}

export class SyncBrandRequestDto {
  @ApiProperty({ type: [SyncBrandDto] })
  brands: SyncBrandDto[];
}

export class SyncBrandResultDto {
  @ApiProperty({ example: 'uuid-local-brand' })
  id: string;

  @ApiProperty({ example: 'synced' })
  status: string;

  @ApiProperty({ example: 'uuid-server-brand' })
  serverId?: string;

  @ApiProperty({ example: 'Optional error message', required: false })
  message?: string;
}

export class SyncBrandResponseDto {
  @ApiProperty({ type: [SyncBrandResultDto] })
  results: SyncBrandResultDto[];
}

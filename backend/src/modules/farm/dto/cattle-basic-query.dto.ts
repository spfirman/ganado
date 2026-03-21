import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, Min, IsOptional, IsString } from 'class-validator';

export class CattleBasicQueryDto {
  @ApiPropertyOptional({ description: 'Cantidad por página', default: 500, minimum: 1, maximum: 1000 })
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  limit: number = 500;

  @ApiPropertyOptional({ description: 'Cursor opaco de la página anterior (base64 JSON)' })
  @IsOptional()
  @IsString()
  cursor?: string;

  @ApiPropertyOptional({
    description: 'Delta-sync: traer registros con updatedAt > updated_after (ISO-8601). Ej: 2025-08-01T00:00:00Z',
    example: '2025-08-01T00:00:00Z',
  })
  @IsOptional()
  @IsString()
  updated_after?: string;
}

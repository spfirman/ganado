import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsDateString, IsString, IsInt, Min, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class PurchaseListQueryDto {
  @ApiPropertyOptional({ example: 1, minimum: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;

  @ApiPropertyOptional({ example: 10, minimum: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit = 10;

  @ApiPropertyOptional({ description: 'YYYY-MM-DD' })
  @IsOptional()
  @IsDateString()
  from?: string;

  @ApiPropertyOptional({ description: 'YYYY-MM-DD' })
  @IsOptional()
  @IsDateString()
  to?: string;

  @ApiPropertyOptional({ description: 'Texto a buscar en proveedor' })
  @IsOptional()
  @IsString()
  provider?: string;

  @ApiPropertyOptional({ enum: ['all', 'open', 'received'], default: 'all' })
  @IsOptional()
  @IsIn(['all', 'open', 'received'])
  status: string = 'all';
}

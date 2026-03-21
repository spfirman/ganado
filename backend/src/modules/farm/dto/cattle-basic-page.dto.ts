import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CattleBasicResponseDto } from './cattle-basic-response.dto';

export class CattleBasicPageDto {
  @ApiProperty({ type: [CattleBasicResponseDto] })
  items: CattleBasicResponseDto[];

  @ApiPropertyOptional({ description: 'Cursor para la siguiente página (null si no hay más)' })
  nextCursor: string | null;

  @ApiProperty({ description: 'Indica si hay más páginas' })
  hasMore: boolean;

  @ApiPropertyOptional({ description: 'Total de elementos (puede ser null si no se calcula)' })
  total: number | null;
}

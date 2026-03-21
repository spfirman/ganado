import { ApiProperty } from '@nestjs/swagger';

export class PagedResponseDto<T> {
  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  total: number;

  @ApiProperty()
  hasMore: boolean;

  @ApiProperty({ isArray: true })
  items: T[];

  static of<T>(p: number, l: number, total: number, items: T[]): PagedResponseDto<T> {
    return { page: p, limit: l, total, hasMore: p * l < total, items };
  }
}

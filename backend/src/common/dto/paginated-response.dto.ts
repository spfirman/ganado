import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber } from 'class-validator';

export class PaginatedResponseDto<T> {
  @IsArray()
  @ApiProperty({ isArray: true })
  items: T[];

  @IsNumber()
  @ApiProperty()
  total: number;
}

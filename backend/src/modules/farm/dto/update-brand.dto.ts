import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateBrandDto {
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  image?: any;
}

import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class LogoutDto {
  @ApiPropertyOptional({
    example: '3f4f7d2c...refresh_token_value...',
    description: 'Refresh token opcional para revocación explícita',
  })
  @IsString()
  @IsOptional()
  refresh_token?: string;
}

import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class RefreshTokenDto {
  @ApiPropertyOptional({
    example: '3f4f7d2c...refresh_token_value...',
    description: 'Refresh token vigente (snake_case)',
  })
  @IsString()
  @IsOptional()
  refresh_token?: string;

  @ApiPropertyOptional({
    example: '3f4f7d2c...refresh_token_value...',
    description: 'Refresh token vigente (camelCase)',
  })
  @IsString()
  @IsOptional()
  refreshToken?: string;
}

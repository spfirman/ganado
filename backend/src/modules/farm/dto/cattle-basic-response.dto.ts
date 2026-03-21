import { ApiProperty } from '@nestjs/swagger';

export class CattleBasicResponseDto {
  @ApiProperty({ description: 'Tenant ID' })
  idTenant: string;

  @ApiProperty({ description: 'Cattle ID' })
  id: string;

  @ApiProperty({ description: 'Cattle number' })
  number: string;

  @ApiProperty({ description: 'Cattle system number' })
  sysNumber: string;
}

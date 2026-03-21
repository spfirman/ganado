import { ApiProperty } from '@nestjs/swagger';

export class DeviceResponseDto {
  @ApiProperty({ description: 'ID del dispositivo' })
  id: string;

  @ApiProperty({ description: 'ID del perfil de dispositivo' })
  idDeviceProfile: string;

  @ApiProperty({ description: 'DevEUI del dispositivo' })
  deveui: string;

  @ApiProperty({ description: 'Nombre del dispositivo' })
  name: string;

  @ApiProperty({ description: 'Descripcion del dispositivo' })
  description: string;

  @ApiProperty({ description: 'ID de la aplicacion de ChipStack' })
  csApplicationId: string;

  @ApiProperty({ description: 'JoinEUI del dispositivo' })
  csJoineui: string;

  @ApiProperty({ description: 'AppKey del dispositivo' })
  csAppKey: string;

  @ApiProperty({ description: 'NwkKey del dispositivo' })
  csNwkKey: string;

  @ApiProperty({ description: 'Tags del dispositivo' })
  tags: Record<string, any>;

  @ApiProperty({ description: 'Variables del dispositivo' })
  variables: Record<string, any>;

  @ApiProperty({ description: 'Estado del dispositivo' })
  isActive: boolean;

  @ApiProperty({ description: 'Fecha de creacion del dispositivo' })
  createdAt: Date;

  @ApiProperty({ description: 'Fecha de actualizacion del dispositivo' })
  updatedAt: Date;
}

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional, IsObject, IsIP } from 'class-validator';
import { BridgeDeviceType } from '../enums/weighing-source.enum';

export class RegisterDeviceDto {
  @ApiProperty({ description: 'Device display name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Device type', enum: BridgeDeviceType })
  @IsEnum(BridgeDeviceType)
  type: BridgeDeviceType;

  @ApiPropertyOptional({ description: 'Device IP address on farm LAN' })
  @IsOptional()
  @IsString()
  ipAddress?: string;

  @ApiPropertyOptional({ description: 'Device configuration JSON' })
  @IsOptional()
  @IsObject()
  configJson?: Record<string, any>;
}

export class DeviceHeartbeatDto {
  @ApiPropertyOptional({ description: 'Current device status details' })
  @IsOptional()
  @IsObject()
  statusDetails?: Record<string, any>;
}

export class BridgeStatusResponseDto {
  @ApiProperty()
  deviceId: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  lastSeenAt: Date;

  @ApiPropertyOptional()
  pollIntervalMs?: number;

  @ApiPropertyOptional()
  cameraSettings?: Record<string, any>;

  @ApiPropertyOptional()
  scaleSettings?: Record<string, any>;
}

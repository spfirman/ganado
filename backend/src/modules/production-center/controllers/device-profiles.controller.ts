import { Controller, Post, Get, Put, Delete, Body, Param, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DeviceProfilesService } from '../services/device-profiles.service';
import { CreateDeviceProfileDto } from '../dto/create-device-profile.dto';
import { UpdateDeviceProfileDto } from '../dto/update-device-profile.dto';
import { DeviceProfileResponseDto } from '../dto/device-profile-response.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ApplicationPermissionsGuard } from '../../../common/application-permissions/application-permissions.guard';
import { RequireAction, RequireEntity, RequireModule } from '../../../common/application-permissions/application-permissions.decorator';
import { SessionUser } from '../../../common/decorators/session-user.decorator';
import { SessionUserDto } from '../../auth/dto/session-user.dto';

@ApiTags('Device Profiles')
@ApiBearerAuth('access-token')
@Controller('device-profiles')
@UseGuards(JwtAuthGuard, ApplicationPermissionsGuard)
@RequireModule('PROD_CENTER')
@RequireEntity('device_profiles')
export class DeviceProfilesController {
  constructor(private readonly deviceProfilesService: DeviceProfilesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo perfil de dispositivo' })
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({ status: 201, description: 'Perfil de dispositivo creado exitosamente', type: DeviceProfileResponseDto })
  @RequireAction('create')
  async create(
    @SessionUser() sessionUser: SessionUserDto,
    @Body() createDeviceProfileDto: CreateDeviceProfileDto,
  ): Promise<any> {
    createDeviceProfileDto.idTenant = sessionUser.tenant_id;
    createDeviceProfileDto.createdAt = new Date();
    createDeviceProfileDto.updatedAt = new Date();
    return await this.deviceProfilesService.create(createDeviceProfileDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los perfiles de dispositivo' })
  @ApiResponse({ status: 200, description: 'Lista de perfiles de dispositivo', type: [DeviceProfileResponseDto] })
  @RequireAction('list')
  async findAll(@SessionUser() sessionUser: SessionUserDto): Promise<any> {
    return await this.deviceProfilesService.findAll(sessionUser.tenant_id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un perfil de dispositivo por ID' })
  @ApiResponse({ status: 200, description: 'Perfil de dispositivo encontrado', type: DeviceProfileResponseDto })
  @RequireAction('read')
  async findOne(
    @Param('id') id: string,
    @SessionUser() sessionUser: SessionUserDto,
  ): Promise<any> {
    return await this.deviceProfilesService.findOne(id, sessionUser.tenant_id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un perfil de dispositivo' })
  @ApiResponse({ status: 200, description: 'Perfil de dispositivo actualizado', type: DeviceProfileResponseDto })
  @RequireAction('update')
  async update(
    @Param('id') id: string,
    @SessionUser() sessionUser: SessionUserDto,
    @Body() updateDeviceProfileDto: UpdateDeviceProfileDto,
  ): Promise<any> {
    updateDeviceProfileDto.updatedAt = new Date();
    return await this.deviceProfilesService.update(id, sessionUser.tenant_id, updateDeviceProfileDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un perfil de dispositivo' })
  @ApiResponse({ status: 200, description: 'Perfil de dispositivo eliminado' })
  @RequireAction('delete')
  async remove(
    @Param('id') id: string,
    @SessionUser() sessionUser: SessionUserDto,
  ): Promise<void> {
    return await this.deviceProfilesService.remove(id, sessionUser.tenant_id);
  }
}

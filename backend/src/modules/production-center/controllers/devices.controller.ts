import { Controller, Post, Get, Put, Delete, Body, Param, HttpCode, HttpStatus, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { DevicesService } from '../services/devices.service';
import { CreateDeviceDto } from '../dto/create-device.dto';
import { UpdateDeviceDto } from '../dto/update-device.dto';
import { DeviceResponseDto } from '../dto/device-response.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ApplicationPermissionsGuard } from '../../../common/application-permissions/application-permissions.guard';
import { RequireAction, RequireEntity, RequireModule } from '../../../common/application-permissions/application-permissions.decorator';
import { SessionUser } from '../../../common/decorators/session-user.decorator';
import { SessionUserDto } from '../../auth/dto/session-user.dto';

@ApiTags('Devices')
@Controller('devices')
@ApiBearerAuth('access-token')
@RequireEntity('devices')
@RequireModule('PROD_CENTER')
@UseGuards(JwtAuthGuard, ApplicationPermissionsGuard)
export class DevicesController {
  constructor(private readonly deviceService: DevicesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo dispositivo' })
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({ status: 201, description: 'Dispositivo creado exitosamente', type: DeviceResponseDto })
  @RequireAction('create')
  async create(
    @SessionUser() sessionUser: SessionUserDto,
    @Body() createDeviceDto: CreateDeviceDto,
  ): Promise<any> {
    createDeviceDto.idTenant = sessionUser.tenant_id;
    createDeviceDto.createdAt = new Date();
    createDeviceDto.updatedAt = new Date();
    return await this.deviceService.create(createDeviceDto);
  }

  @Get(':deveui')
  @ApiOperation({ summary: 'Obtener un dispositivo por ID' })
  @ApiResponse({ status: 200, description: 'Dispositivo encontrado', type: DeviceResponseDto })
  @RequireAction('read')
  async findOne(
    @Param('deveui') deveui: string,
    @SessionUser() sessionUser: SessionUserDto,
  ): Promise<any> {
    return await this.deviceService.findOne(deveui, sessionUser.tenant_id);
  }

  @Put(':deveui')
  @ApiOperation({ summary: 'Actualizar un dispositivo' })
  @ApiResponse({ status: 200, description: 'Dispositivo actualizado', type: DeviceResponseDto })
  @RequireAction('update')
  async update(
    @Param('deveui') deveui: string,
    @SessionUser() sessionUser: SessionUserDto,
    @Body() updateDeviceDto: UpdateDeviceDto,
  ): Promise<any> {
    updateDeviceDto.updatedAt = new Date();
    return await this.deviceService.update(deveui, sessionUser.tenant_id, updateDeviceDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un dispositivo' })
  @ApiResponse({ status: 200, description: 'Dispositivo eliminado' })
  @RequireAction('delete')
  async remove(
    @Param('id') id: string,
    @SessionUser() sessionUser: SessionUserDto,
  ): Promise<void> {
    return await this.deviceService.remove(id, sessionUser.tenant_id);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los dispositivos' })
  @ApiResponse({ status: 200, description: 'Lista de dispositivos', type: [DeviceResponseDto] })
  @RequireAction('list')
  async list(@SessionUser() sessionUser: SessionUserDto): Promise<any> {
    return await this.deviceService.findAll(sessionUser.tenant_id);
  }

  @Post('import')
  @RequireAction('create')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(xlsx)$/)) {
          return cb(new Error('Solo archivos .xlsx permitidos'), false);
        }
        cb(null, true);
      },
    }),
  )
  @ApiOperation({ summary: 'Importar archivo Excel (.xlsx)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Archivo Excel + datos',
    schema: {
      type: 'object',
      required: ['file'],
      properties: {
        deviceProfileId: {
          type: 'string',
          example: '12345e8d-926c-800c-bff5-490e7f8c6051',
        },
        file: {
          description:
            'Archivo Excel, tiene este orden de columnas: devEui, deviceName, deviceProfileId, description, joinEui, nwkKey, tags, variables. Los valores mandatorios son: devEui y deviceName. Si no se envia deviceProfileId en el excel, se debe enviar en el body de la peticion. Si no se envia joinEui, nwkKey se tomaran del deviceProfile.',
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({ status: 201, description: 'Archivo procesado correctamente' })
  async importarExcel(
    @UploadedFile() file: any,
    @Body() body: any,
    @SessionUser() sessionUser: SessionUserDto,
  ): Promise<any> {
    const result = await this.deviceService.importDevicesFromExcel(file, sessionUser.tenant_id, body.deviceProfileId);
    return result;
  }
}

import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  ForbiddenException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { TenantsService } from '../services/tenants.service';
import { CreateTenantDto } from '../dto/create-tenant.dto';
import { Tenant } from '../entities/tenant.entity';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ApplicationPermissionsGuard } from '../../../common/application-permissions/application-permissions.guard';
import {
  RequireModule,
  RequireEntity,
  RequireAction,
} from '../../../common/application-permissions/application-permissions.decorator';
import { SessionUserDto } from '../../auth/dto/session-user.dto';
import { SessionUser } from '../../../common/decorators/session-user.decorator';

@ApiTags('Tenants')
@Controller('tenants')
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Post()
  @ApiOperation({
    summary: 'Crear un nuevo tenant con usuario administrador',
  })
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: 201,
    description:
      'El tenant ha sido creado exitosamente con su usuario administrador',
    type: CreateTenantDto,
  })
  @ApiResponse({ status: 400, description: 'Datos invalidos' })
  @ApiResponse({
    status: 409,
    description: 'El nombre de usuario de la compania ya existe',
  })
  async create(@Body() createTenantDto: CreateTenantDto): Promise<Tenant> {
    return this.tenantsService.create(createTenantDto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, ApplicationPermissionsGuard)
  @RequireModule('EMP_MGMT')
  @RequireEntity('tenants')
  @RequireAction('read')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Obtener un tenant por ID' })
  @ApiResponse({
    status: 200,
    description: 'El tenant ha sido encontrado',
    type: Tenant,
  })
  @ApiResponse({ status: 404, description: 'Tenant no encontrado' })
  async read(
    @SessionUser() sessionUser: SessionUserDto,
    @Param('id') id: string,
  ): Promise<Tenant> {
    if (sessionUser.tenant_id !== id) {
      throw new ForbiddenException(
        'No tienes permisos para acceder a este tenant',
      );
    }
    return this.tenantsService.findOne(id);
  }
}

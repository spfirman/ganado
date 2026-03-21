import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Logger,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ApplicationPermissionsGuard } from '../../../common/application-permissions/application-permissions.guard';
import {
  RequireAction,
  RequireEntity,
  RequireModule,
} from '../../../common/application-permissions/application-permissions.decorator';
import { RoleService } from '../services/roles.service';
import { RoleModulePermission } from '../entities/role-module-permission.entity';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { SessionUserDto } from '../../auth/dto/session-user.dto';
import { SessionUser } from '../../../common/decorators/session-user.decorator';
import {
  CreatePermissionDto,
  CreatePermissionResponseDto,
} from '../dto/create-permission.dto';
import { RoleModulePermissionService } from '../services/role-module-permission.services';
import { RoleReadDto } from '../dto/role-read.dto';
import { UpdatePermissionDto } from '../dto/update-permission.dto';

@ApiTags('Roles')
@ApiBearerAuth('access-token')
@Controller('roles')
@UseGuards(JwtAuthGuard, ApplicationPermissionsGuard)
@RequireModule('EMP_MGMT')
export class RolesController {
  private readonly logger = new Logger(RolesController.name);

  constructor(
    private readonly roleService: RoleService,
    private readonly roleModulePermissionService: RoleModulePermissionService,
  ) {}

  @Get()
  @RequireAction('list')
  @RequireEntity('roles')
  @ApiOperation({ summary: 'Obtener todos los roles' })
  @ApiResponse({
    status: 200,
    description: 'Lista de roles obtenida exitosamente',
    type: [RoleReadDto],
  })
  @ApiResponse({
    status: 403,
    description: 'No tienes permisos para ver roles',
  })
  async findAll(@SessionUser() requestUser: SessionUserDto): Promise<RoleReadDto[]> {
    return this.roleService.findAll(requestUser.tenant_id);
  }

  @Get(':id')
  @RequireAction('read')
  @RequireEntity('roles')
  @ApiOperation({ summary: 'Obtener un rol por ID' })
  @ApiResponse({
    status: 200,
    description: 'Rol encontrado exitosamente',
    type: RoleReadDto,
  })
  @ApiResponse({ status: 404, description: 'Rol no encontrado' })
  findOne(@Param('id') id: string): Promise<RoleReadDto> {
    return this.roleService.findOne(id);
  }

  @Post('permissions')
  @RequireAction('create')
  @RequireEntity('permissions')
  @ApiOperation({ summary: 'Crear permiso para un rol' })
  @ApiBody({
    type: CreatePermissionDto,
    description: 'Datos del permiso a crear',
    required: true,
  })
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: 201,
    description: 'Permiso creado exitosamente',
    type: CreatePermissionResponseDto,
  })
  createPermission(
    @SessionUser() requestUser: SessionUserDto,
    @Body() createPermissionDto: CreatePermissionDto,
  ): Promise<RoleModulePermission> {
    return this.roleModulePermissionService.createPermission(
      requestUser.tenant_id,
      createPermissionDto,
    );
  }

  @Put(':roleId/permissions/:moduleId')
  @RequireAction('update')
  @RequireEntity('permissions')
  @ApiOperation({ summary: 'Actualizar permiso de un rol' })
  @ApiBody({
    type: UpdatePermissionDto,
    description: 'Datos del permiso a actualizar',
    required: true,
    examples: {
      example1: {
        summary: 'Actualizar todos los permisos de un rol',
        value: {
          can_create: true,
          can_read: true,
          can_update: true,
          can_delete: true,
          can_list: true,
        },
      },
      example2: {
        summary: 'Actualizar solo el permiso de creacion',
        value: {
          can_create: true,
        },
      },
      example3: {
        summary: 'Actualizar solo el permiso de lectura y actualizacion',
        value: {
          can_read: true,
          can_update: true,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Permiso actualizado exitosamente',
    type: CreatePermissionResponseDto,
  })
  updatePermission(
    @SessionUser() sessionUser: SessionUserDto,
    @Param('roleId') roleId: string,
    @Param('moduleId') moduleId: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ): Promise<RoleModulePermission> {
    this.logger.debug(
      `Actualizando permiso para el rol ${roleId} y el modulo ${moduleId} con los datos: ${JSON.stringify(updatePermissionDto)}`,
    );
    return this.roleModulePermissionService.updatePermission(
      roleId,
      sessionUser.tenant_id,
      moduleId,
      updatePermissionDto,
    );
  }

  @Delete(':roleId/permissions/:moduleId')
  @RequireAction('delete')
  @RequireEntity('permissions')
  @ApiOperation({ summary: 'Eliminar permiso de un rol' })
  @ApiResponse({
    status: 200,
    description: 'Permiso eliminado exitosamente',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Permiso eliminado exitosamente',
        },
        roleId: {
          type: 'string',
          example: '123e4567-e89b-12d3-a456-426614174000',
        },
        moduleId: {
          type: 'string',
          example: '123e4567-e89b-12d3-a456-426614174001',
        },
      },
    },
  })
  async removePermission(
    @SessionUser() sessionUser: SessionUserDto,
    @Param('roleId') roleId: string,
    @Param('moduleId') moduleId: string,
  ): Promise<{ message: string; roleId: string; moduleId: string }> {
    await this.roleModulePermissionService.deletePermission(
      roleId,
      sessionUser.tenant_id,
      moduleId,
    );
    return {
      message: 'Permiso eliminado exitosamente',
      roleId,
      moduleId,
    };
  }

  @Get('permissions/:roleId')
  @RequireAction('list')
  @RequireEntity('permissions')
  @ApiOperation({ summary: 'Listar permisos de un rol' })
  @ApiResponse({
    status: 200,
    description: 'Lista de permisos obtenida exitosamente',
    type: [RoleModulePermission],
  })
  listPermissions(
    @SessionUser() sessionUser: SessionUserDto,
    @Param('roleId') roleId: string,
  ): Promise<RoleModulePermission[]> {
    const permissions = this.roleModulePermissionService.listPermissions(
      roleId,
      sessionUser.tenant_id,
    );
    return permissions;
  }
}

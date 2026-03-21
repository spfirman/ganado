import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { ProviderService } from '../services/provider.service';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { ApplicationPermissionsGuard } from '../../../common/application-permissions/application-permissions.guard';
import { SessionUser } from '../../../common/decorators/session-user.decorator';
import { SessionUserDto } from '../../auth/dto/session-user.dto';
import {
  RequireAction,
  RequireEntity,
  RequireModule,
} from '../../../common/application-permissions/application-permissions.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateProviderDto } from '../dto/create-provider.dto';
import { UpdateProviderDto } from '../dto/update-provider.dto';
import { ProviderResponseDto } from '../dto/provider-response.dto';

@ApiTags('Provider')
@ApiBearerAuth('access-token')
@Controller('providers')
@RequireEntity('providers')
@RequireModule('COMMERCE')
@UseGuards(JwtAuthGuard, ApplicationPermissionsGuard)
export class ProviderController {
  constructor(private readonly providerService: ProviderService) {}

  @Post()
  @RequireAction('create')
  @ApiOperation({ summary: 'Create a new provider' })
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: 201,
    description: 'Provider created successfully',
    type: ProviderResponseDto,
  })
  @ApiResponse({ status: 409, description: 'NIT already exists for this tenant' })
  @ApiBody({
    type: CreateProviderDto,
    required: true,
    examples: {
      example1: {
        summary: 'Mandatory fields',
        value: {
          nit: '1234567890',
          name: 'Provider 1',
        },
      },
    },
  })
  async create(
    @Body() body: CreateProviderDto,
    @SessionUser() user: SessionUserDto,
  ): Promise<ProviderResponseDto> {
    const provider = await this.providerService.createProvider({
      ...body,
      idTenant: user.tenant_id,
    });
    return ProviderResponseDto.toProviderResponse(provider);
  }

  @Get('search')
  @RequireAction('read')
  @ApiOperation({ summary: 'Search providers by name' })
  @ApiQuery({ name: 'name', required: true, description: 'Search term for provider name' })
  @ApiQuery({
    name: 'type',
    required: false,
    description: 'Filter by provider type (BUYER, TRANSPORTER, VET, OTHER)',
  })
  @ApiResponse({
    status: 200,
    description: 'List of matching providers with contact info',
    type: [ProviderResponseDto],
  })
  async searchByName(
    @SessionUser() user: SessionUserDto,
    @Query('name') name: string,
    @Query('type') type: string,
  ): Promise<ProviderResponseDto[]> {
    const providers = await this.providerService.searchByName(name, user.tenant_id);
    const filtered = type ? providers.filter((p) => p.type === type) : providers;
    return filtered.map(ProviderResponseDto.toProviderResponse);
  }

  @Get('search/by-nit')
  @RequireAction('read')
  @ApiQuery({ name: 'query', required: true, description: 'Fragmento parcial del NIT' })
  @ApiResponse({
    status: 200,
    description: 'Proveedores coincidentes con fragmento del NIT',
    type: [ProviderResponseDto],
  })
  async searchByNit(
    @Query('query') query: string,
    @SessionUser() session: SessionUserDto,
  ): Promise<ProviderResponseDto[]> {
    const results = await this.providerService.searchProvidersByNit(query, session.tenant_id);
    return results.map(ProviderResponseDto.toProviderResponse);
  }

  @Get(':id')
  @RequireAction('read')
  @ApiOperation({ summary: 'Find provider by ID' })
  @ApiResponse({ status: 200, description: 'Provider found', type: ProviderResponseDto })
  @ApiResponse({ status: 404, description: 'Provider not found by ID' })
  async findById(
    @Param('id') id: string,
    @SessionUser() user: SessionUserDto,
  ): Promise<ProviderResponseDto> {
    return ProviderResponseDto.toProviderResponse(
      await this.providerService.findById(id, user.tenant_id),
    );
  }

  @Get('nit/:nit')
  @RequireAction('read')
  @ApiOperation({ summary: 'Find provider by NIT' })
  @ApiResponse({ status: 200, description: 'Provider found', type: ProviderResponseDto })
  @ApiResponse({ status: 404, description: 'Provider not found by NIT' })
  async findByNit(
    @Param('nit') nit: string,
    @SessionUser() user: SessionUserDto,
  ): Promise<ProviderResponseDto> {
    return ProviderResponseDto.toProviderResponse(
      await this.providerService.findByNit(nit, user.tenant_id),
    );
  }

  @Get()
  @RequireAction('read')
  @ApiOperation({ summary: 'Get all providers by tenant' })
  @ApiQuery({
    name: 'type',
    required: false,
    description: 'Filter by provider type (BUYER, TRANSPORTER, VET, OTHER, PROVIDER)',
  })
  @ApiResponse({ status: 200, description: 'List of providers', type: [ProviderResponseDto] })
  async findAll(
    @SessionUser() user: SessionUserDto,
    @Query('type') type: string,
  ): Promise<ProviderResponseDto[]> {
    const providers = await this.providerService.findAll(user.tenant_id);
    const filtered = type ? providers.filter((p) => p.type === type) : providers;
    return filtered.map(ProviderResponseDto.toProviderResponse);
  }

  @Put(':id')
  @RequireAction('update')
  @ApiOperation({ summary: 'Update provider by ID' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({ status: 204, description: 'Provider updated' })
  @ApiResponse({ status: 404, description: 'Provider not found by ID' })
  @ApiResponse({ status: 409, description: 'NIT already exists for this tenant' })
  @ApiBody({
    type: UpdateProviderDto,
    required: true,
    examples: {
      example1: {
        summary: 'Nit only',
        value: {
          nit: '1234567890',
        },
      },
      example2: {
        summary: 'Name only',
        value: {
          name: 'Provider 1',
        },
      },
      example3: {
        summary: 'All fields',
        value: {
          nit: '1234567890',
          name: 'Provider 1',
        },
      },
    },
  })
  async updateById(
    @Param('id') id: string,
    @Body() data: UpdateProviderDto,
    @SessionUser() user: SessionUserDto,
  ): Promise<void> {
    await this.providerService.updateById(id, user.tenant_id, data);
  }

  @Put('nit/:nit')
  @RequireAction('update')
  @ApiOperation({ summary: 'Update provider by NIT (NIT cannot be changed)' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({ status: 204, description: 'Provider updated' })
  @ApiResponse({ status: 400, description: 'NIT update not allowed in this endpoint' })
  @ApiResponse({ status: 404, description: 'Provider not found by NIT' })
  @ApiBody({
    type: UpdateProviderDto,
    required: true,
    examples: {
      example1: {
        summary: 'Name only',
        value: {
          name: 'Provider 1',
        },
      },
    },
  })
  async updateByNit(
    @Param('nit') nit: string,
    @Body() data: UpdateProviderDto,
    @SessionUser() user: SessionUserDto,
  ): Promise<void> {
    if ('nit' in data && data.nit !== undefined && data.nit !== null) {
      throw new BadRequestException('NIT update not allowed in this endpoint');
    }
    await this.providerService.updateByNit(nit, user.tenant_id, data);
  }

  @Delete(':id')
  @RequireAction('delete')
  @ApiOperation({ summary: 'Delete provider by ID' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({ status: 204, description: 'Provider deleted' })
  async deleteById(
    @Param('id') id: string,
    @SessionUser() user: SessionUserDto,
  ): Promise<void> {
    await this.providerService.deleteById(id, user.tenant_id);
  }

  @Delete('nit/:nit')
  @RequireAction('delete')
  @ApiOperation({ summary: 'Delete provider by NIT' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({ status: 204, description: 'Provider deleted' })
  async deleteByNit(
    @Param('nit') nit: string,
    @SessionUser() user: SessionUserDto,
  ): Promise<void> {
    await this.providerService.deleteByNit(nit, user.tenant_id);
  }
}

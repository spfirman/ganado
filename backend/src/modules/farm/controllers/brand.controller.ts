import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
  UseGuards,
  HttpCode,
  HttpStatus,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { FileInterceptor, AnyFilesInterceptor } from '@nestjs/platform-express';
import { BrandService } from '../services/brand.service';
import { CreateBrandDto } from '../dto/create-brand.dto';
import { UpdateBrandDto } from '../dto/update-brand.dto';
import { BrandResponseDto } from '../dto/brand-response.dto';
import { memoryStorage } from 'multer';
import { SyncBrandResponseDto, SyncBrandDto } from '../dto/sync-brand.dto';
import {
  ApiTags,
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { RequireAction, RequireEntity, RequireModule } from '../../../common/application-permissions/application-permissions.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ApplicationPermissionsGuard } from '../../../common/application-permissions/application-permissions.guard';
import { SessionUser } from '../../../common/decorators/session-user.decorator';
import { SessionUserDto } from '../../auth/dto/session-user.dto';

@ApiTags('Brands')
@ApiBearerAuth('access-token')
@Controller('brands')
@RequireEntity('brands')
@RequireModule('FARM')
@UseGuards(JwtAuthGuard, ApplicationPermissionsGuard)
export class BrandController {
  private readonly logger = new Logger(BrandController.name);

  constructor(private readonly brandService: BrandService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage(),
      fileFilter: (req, file, cb) => {
        const allowed = ['image/png', 'image/jpg', 'image/jpeg'];
        if (!allowed.includes(file.mimetype)) {
          return cb(
            new BadRequestException('Solo se permiten imágenes PNG o JPEG'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Create a new brand' })
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: 201,
    description: 'Brand created successfully',
    type: BrandResponseDto,
  })
  @RequireAction('create')
  @ApiBody({
    type: CreateBrandDto,
    required: true,
    examples: {
      example1: {
        summary: 'Basic brand creation',
        value: { name: 'Marca A' },
      },
      example2: {
        summary: 'Another brand',
        value: { name: 'Marca B' },
      },
    },
  })
  async create(
    @SessionUser() sessionUser: SessionUserDto,
    @Body() dto: CreateBrandDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<BrandResponseDto> {
    if (!file || !file.buffer || file.size === 0) {
      throw new BadRequestException('The image is requested');
    }
    if ('image' in dto) {
      delete dto.image;
    }
    const brand = await this.brandService.create(
      sessionUser.tenant_id,
      dto,
      file,
    );
    return BrandResponseDto.toResponseDto(brand);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a brand by ID' })
  @ApiResponse({
    status: 200,
    description: 'Brand found',
    type: BrandResponseDto,
  })
  @RequireAction('read')
  async findOne(
    @Param('id') id: string,
    @SessionUser() sessionUser: SessionUserDto,
  ): Promise<BrandResponseDto> {
    const brand = await this.brandService.findByIdOrFail(
      sessionUser.tenant_id,
      id,
    );
    return BrandResponseDto.toResponseDto(brand);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a brand' })
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage(),
      fileFilter: (req, file, cb) => {
        const allowed = ['image/png', 'image/jpeg'];
        if (!allowed.includes(file.mimetype)) {
          return cb(
            new BadRequestException('Solo se permiten imágenes PNG o JPEG'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 200,
    description: 'Brand updated',
    type: BrandResponseDto,
  })
  @RequireAction('update')
  async update(
    @Param('id') id: string,
    @SessionUser() sessionUser: SessionUserDto,
    @Body() dto: UpdateBrandDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<BrandResponseDto> {
    if (file && file.size === 0) {
      throw new BadRequestException('La imagen no puede estar vacía');
    }
    if ('image' in dto) {
      delete dto.image;
    }
    const brand = await this.brandService.update(
      sessionUser.tenant_id,
      id,
      dto,
      file,
    );
    return BrandResponseDto.toResponseDto(brand);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a brand' })
  @ApiResponse({ status: 200, description: 'Brand deleted successfully' })
  @RequireAction('delete')
  remove(
    @Param('id') id: string,
    @SessionUser() sessionUser: SessionUserDto,
  ) {
    return this.brandService.remove(sessionUser.tenant_id, id);
  }

  @Get()
  @ApiOperation({ summary: 'List all brands' })
  @ApiResponse({
    status: 200,
    description: 'List of brands',
    type: [BrandResponseDto],
  })
  @RequireAction('read')
  async list(
    @SessionUser() sessionUser: SessionUserDto,
  ): Promise<BrandResponseDto[]> {
    const brands = await this.brandService.findAll(sessionUser.tenant_id);
    return brands.map(BrandResponseDto.toResponseDto);
  }

  @Post('sync')
  @UseInterceptors(AnyFilesInterceptor())
  @ApiConsumes('multipart/form-data')
  @RequireAction('create')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        brands: {
          type: 'string',
          description: 'Lista JSON de marcas a sincronizar',
          example: JSON.stringify([
            { id: 'uuid-local-1', idTenant: 'tenant-uuid', name: 'Marca A' },
            { id: 'uuid-local-2', idTenant: 'tenant-uuid', name: 'Marca B' },
          ]),
        },
        image_uuid_local_1: {
          type: 'string',
          format: 'binary',
        },
        image_uuid_local_2: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiOperation({ summary: 'Sync offline-created brands to backend' })
  @ApiResponse({
    status: 200,
    description: 'Sync results',
    type: SyncBrandResponseDto,
  })
  async syncBrands(
    @SessionUser() sessionUser: SessionUserDto,
    @Body('brands') brandsJson: string,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<{ results: any[] }> {
    const brands = await SyncBrandDto.parseAndValidateBrands(brandsJson);
    const filesMap = new Map(files.map((f) => [f.fieldname, f]));
    const results = await this.brandService.syncBrands(
      sessionUser.tenant_id,
      brands,
      filesMap,
    );
    return { results };
  }
}

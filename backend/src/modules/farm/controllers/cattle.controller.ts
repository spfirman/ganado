import {
  Controller,
  Post,
  Get,
  Patch,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { CattleService } from '../services/cattle.service';
import { CreateCattleDto } from '../dto/create-cattle.dto';
import { UpdateCattleDto } from '../dto/update-cattle.dto';
import { CreateCattleMedicationHistoryDto } from '../dto/create-cattle-medication-history.dto';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger';
import { RequireAction, RequireEntity, RequireModule } from '../../../common/application-permissions/application-permissions.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ApplicationPermissionsGuard } from '../../../common/application-permissions/application-permissions.guard';
import { CattleResponseDto } from '../dto/cattle-response.dto';
import { CattleBasicResponseDto } from '../dto/cattle-basic-response.dto';
import { CattleBasicPageDto } from '../dto/cattle-basic-page.dto';
import { CattleBasicQueryDto } from '../dto/cattle-basic-query.dto';
import { CattleListQueryDto } from '../dto/cattle-list.query.dto';
import { PagedResponseDto } from '../../../shared/dto/paged-response.dto';
import { SessionUser } from '../../../common/decorators/session-user.decorator';
import { SessionUserDto } from '../../auth/dto/session-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ApplySimpleEventsDto } from '../../massive-events/dto/apply-simple-events.dto';
import { AnimalSimpleEventRepository } from '../../massive-events/repositories/animal-simple-event.repository';
import { SyncAnimalSimpleEventResponseDto, SyncAnimalSimpleEventRequestDto } from '../../massive-events/dto/sync-animal-simple-event.dto';
import { AnimalSimpleEvent } from '../../massive-events/entities/animal-simple-event.entity';

@ApiTags('Cattle')
@ApiBearerAuth('access-token')
@Controller('cattle')
@RequireEntity('cattle')
@RequireModule('FARM')
@UseGuards(JwtAuthGuard, ApplicationPermissionsGuard)
export class CattleController {
  private readonly logger = new Logger(CattleController.name);

  constructor(
    private readonly cattleService: CattleService,
    private readonly simpleEventCattleRepository: AnimalSimpleEventRepository,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new cattle' })
  @RequireAction('create')
  @ApiBody({
    type: CreateCattleDto,
    required: true,
    examples: {
      example1: {
        summary: 'Mandatory fields',
        value: {
          sysNumber: '1234567890',
          number: '1234567890',
          receivedAt: '2021-01-01',
          color: 'colors_enum',
          receivedWeight: 100,
          purchasePrice: 100,
          purchaseWeight: 100,
        },
      },
      example2: {
        summary: 'Create a new cattle with all fields',
        value: {
          deveui: 'string',
          sysNumber: 'string',
          number: 'string',
          brand: 'uuid-brand',
          color: 'colors_enum',
          characteristics: ['string'],
          receivedAt: 'string',
          receivedWeight: 0,
          purchaseWeight: 0,
          comments: 'string',
          purchasedFrom: 'string',
          purchasePrice: 0,
          purchaseCommission: 0,
          negotiatedPricePerKg: 0,
          lotPricePerWeight: 0,
        },
      },
    },
  })
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: 201,
    description: 'Cattle created successfully',
    type: CattleResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid request body' })
  @ApiResponse({ status: 404, description: 'Device {deveui} not found' })
  @ApiResponse({ status: 409, description: 'Cattle number already exists' })
  @ApiResponse({
    status: 500,
    description: 'Unexpected error during creation process',
  })
  create(
    @SessionUser() sessionUser: SessionUserDto,
    @Body() dto: CreateCattleDto,
  ) {
    return this.cattleService.create(
      sessionUser.tenant_id,
      dto,
      sessionUser.sub,
    );
  }

  @Get('search')
  @ApiOperation({
    summary: 'Search cattle by number, eartags, or device',
  })
  @ApiResponse({
    status: 200,
    description: 'List of matching cattle',
    type: [CattleResponseDto],
  })
  @RequireAction('read')
  search(
    @SessionUser() sessionUser: SessionUserDto,
    @Query('q') query: string,
  ) {
    return this.cattleService.search(sessionUser.tenant_id, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a cattle by ID' })
  @ApiResponse({
    status: 200,
    description: 'Cattle found',
    type: CattleResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Cattle not found' })
  @RequireAction('read')
  findOne(
    @Param('id') id: string,
    @SessionUser() sessionUser: SessionUserDto,
  ) {
    return this.cattleService.findByIdOrFail(sessionUser.tenant_id, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a cattle' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: 'Cattle updated' })
  @ApiResponse({ status: 404, description: 'Cattle not found' })
  @RequireAction('update')
  update(
    @Param('id') id: string,
    @SessionUser() sessionUser: SessionUserDto,
    @Body() dto: UpdateCattleDto,
  ) {
    return this.cattleService.update(
      sessionUser.tenant_id,
      id,
      dto,
      sessionUser.sub,
    );
  }

  @Post(':id/medication')
  @ApiOperation({ summary: 'Add medication history to a cattle' })
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({ status: 201, description: 'Medication history added' })
  @ApiResponse({ status: 404, description: 'Cattle not found' })
  @RequireAction('update')
  addMedication(
    @Param('id') id: string,
    @SessionUser() sessionUser: SessionUserDto,
    @Body() dto: CreateCattleMedicationHistoryDto,
  ) {
    return this.cattleService.addMedicationHistory(
      sessionUser.tenant_id,
      id,
      dto,
      sessionUser.sub,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a cattle' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({
    status: 204,
    description: 'Cattle deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Cattle not found' })
  @RequireAction('delete')
  remove(
    @Param('id') id: string,
    @SessionUser() sessionUser: SessionUserDto,
  ) {
    this.cattleService.remove(sessionUser.tenant_id, id);
  }

  @Get()
  @ApiOperation({ summary: 'List all cattle' })
  @ApiResponse({
    status: 200,
    description: 'List of cattle',
    type: PagedResponseDto,
  })
  @RequireAction('read')
  async list(
    @SessionUser() sessionUser: SessionUserDto,
    @Query() query: CattleListQueryDto,
  ): Promise<PagedResponseDto<any>> {
    const { items, total, page, limit } =
      await this.cattleService.listPaged(sessionUser.tenant_id, query);
    return PagedResponseDto.of(page, limit, total, items);
  }

  @Get('basic-info')
  @ApiOperation({ summary: 'Get basic info of all cattle' })
  @ApiResponse({
    status: 200,
    description: 'Basic info of all cattle',
    type: [CattleBasicResponseDto],
  })
  @RequireAction('read')
  getBasicInfo(@SessionUser() sessionUser: SessionUserDto) {
    return this.cattleService.getBasicInfo(sessionUser.tenant_id);
  }

  @Get('basic')
  @ApiOperation({
    summary: 'Get basic cattle info (paged with cursor & optional delta)',
  })
  @ApiResponse({ status: 200, type: CattleBasicPageDto })
  @RequireAction('read')
  getBasicInfoPaged(
    @SessionUser() sessionUser: SessionUserDto,
    @Query() query: CattleBasicQueryDto,
  ) {
    return this.cattleService.getBasicInfoPaged(
      sessionUser.tenant_id,
      query,
    );
  }

  @Get('simple-events/:id')
  @ApiOperation({
    summary: 'List all simple events applied to a cattle',
  })
  @ApiResponse({
    status: 200,
    description: 'List of simple events IDs',
  })
  @ApiResponse({ status: 404, description: 'Cattle not found' })
  @RequireAction('read')
  async findSimpleEventsByCattle(
    @Param('id') id: string,
    @SessionUser() sessionUser: SessionUserDto,
  ): Promise<any[]> {
    const links = await this.simpleEventCattleRepository.findByCattle(
      sessionUser.tenant_id,
      id,
    );
    return links.map((link) => ({
      idSimpleEvent: link.idSimpleEvent,
      appliedAt: link.appliedAt,
      appliedBy: link.appliedBy,
    }));
  }

  @Post('apply-events/:cattleNumber')
  @ApiOperation({
    summary: 'Apply multiple simple events to a single cattle by number',
  })
  @ApiResponse({
    status: 200,
    description: 'Events applied successfully',
    type: [AnimalSimpleEvent],
  })
  @ApiResponse({
    status: 404,
    description:
      'Cattle {cattleNumber} not found / Device {deveui} not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Unexpected error during application process',
  })
  @RequireAction('update')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        idMassiveEvent: { type: 'string' },
        events: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              type: {
                type: 'string',
                enum: [
                  'weight',
                  'eartag',
                  'tracker',
                  'brand',
                  'castration',
                  'medication',
                ],
              },
              data: { type: 'object' },
              appliedBy: { type: 'string' },
              idSimpleEvent: { type: 'string' },
            },
          },
        },
      },
    },
    examples: {
      example1: {
        summary: 'Apply multiple events to only one cattle',
        value: {
          applied: {
            idMassiveEvent: 'uuid-massive-event-1',
            events: [
              {
                type: 'weight',
                data: { weight: 350.58 },
                idSimpleEvent: 'uuid-simple-event-1',
              },
              {
                type: 'eartag',
                data: { eartagLeft: 'ET-789', eartagRight: 'ET-790' },
                idSimpleEvent: 'uuid-simple-event-2',
              },
              {
                type: 'tracker',
                data: { tracker_deveui: 'a173ecf6ffe3abcd' },
                idSimpleEvent: 'uuid-simple-event-3',
              },
              {
                type: 'castration',
                data: {},
                idSimpleEvent: 'uuid-simple-event-4',
              },
              {
                type: 'medication',
                data: {
                  medicationName: 'Antrimizin NF 85 mg',
                  dosage: '1.2 mg/kg',
                  route: 'oral',
                  lot: 'LOT-2025',
                },
                idSimpleEvent: 'uuid-simple-event-5',
              },
              {
                type: 'medication',
                data: {
                  medicationName: 'Boldenona 50 mg',
                  dosage: '1 mL/90 Kg',
                  route: 'Intramuscular profunda',
                  lot: 'LOT-2025',
                },
                idSimpleEvent: 'uuid-simple-event-6',
              },
              {
                type: 'brand',
                data: { idBrand: 'abc123' },
                idSimpleEvent: 'uuid-simple-event-7',
              },
            ],
          },
        },
      },
    },
  })
  async applyEventsToSingleCattle(
    @SessionUser() sessionUser: SessionUserDto,
    @Param('cattleNumber') cattleNumber: string,
    @Body('applied') applied: any,
  ): Promise<any[]> {
    const appliedEvents =
      await this.cattleService.applyMultipleSimpleEventsByNumber_transaction(
        sessionUser.tenant_id,
        sessionUser.sub,
        cattleNumber,
        applied.idMassiveEvent,
        applied.events,
      );
    this.logger.debug(
      `log_cattle 1: Applied events: ${appliedEvents}`,
    );
    return appliedEvents;
  }

  @Post('apply-simple-events')
  @ApiOperation({
    summary:
      'Apply multiple simple events to multiple cattle by their number',
  })
  @ApiResponse({
    status: 200,
    description: 'Events applied successfully',
    type: [CattleResponseDto],
  })
  @RequireAction('update')
  @ApiBody({
    type: ApplySimpleEventsDto,
    examples: {
      example1: {
        summary: 'Apply various events',
        value: {
          events: [
            {
              cattleNumber: 'C-001',
              type: 'weight',
              data: { weight: 350 },
              idMassiveEvent: 'uuid-massive-event-1',
              idSimpleEvent: 'uuid-simple-event-1',
            },
            {
              cattleNumber: 'C-002',
              type: 'eartag',
              data: { eartagLeft: 'ET-789' },
              idMassiveEvent: 'uuid-massive-event-1',
              idSimpleEvent: 'uuid-simple-event-2',
            },
            {
              cattleNumber: 'C-003',
              type: 'eartag',
              data: { eartagRight: 'ET-790' },
              idMassiveEvent: 'uuid-massive-event-2',
              idSimpleEvent: 'uuid-simple-event-3',
            },
          ],
        },
      },
    },
  })
  async applySimpleEventsToSeveralCattle(
    @SessionUser() sessionUser: SessionUserDto,
    @Body() body: ApplySimpleEventsDto,
  ): Promise<any> {
    return this.cattleService.applyBulkSimpleEvents(
      sessionUser.tenant_id,
      sessionUser.sub,
      body.events,
    );
  }

  @Post('sync-cattle-simple-event')
  @ApiOperation({
    summary: 'Sync offline cattle-simple-event records to backend',
  })
  @ApiResponse({
    status: 200,
    description: 'Sync results',
    type: SyncAnimalSimpleEventResponseDto,
  })
  @RequireAction('update')
  @ApiBody({
    type: SyncAnimalSimpleEventRequestDto,
    examples: {
      example1: {
        summary: 'Sync multiple SimpleEventCattle',
        value: {
          simpleEventCattle: [
            {
              id: 'uuid-local-1',
              idTenant: 'tenant-uuid',
              cattleNumber: 'C-123',
              type: 'weight',
              dataJson: '{"weight":350}',
              appliedAt: '2025-07-24T10:00:00Z',
              appliedBy: 'user-123',
              idMassiveEvent: 'uuid-massive-event-1',
              idSimpleEvent: 'uuid-simple-event-1',
            },
            {
              id: 'uuid-local-2',
              idTenant: 'tenant-uuid',
              cattleNumber: 'C-999',
              type: 'medication',
              dataJson:
                '{"medicationName":"med-001","dosage":"1ml","route":"oral","lot":"LOT-2025"}',
              appliedAt: '2025-07-24T11:00:00Z',
              appliedBy: 'user-123',
              idMassiveEvent: 'uuid-massive-event-1',
              idSimpleEvent: 'uuid-simple-event-2',
            },
          ],
        },
      },
    },
  })
  async syncSimpleEventCattle(
    @SessionUser() sessionUser: SessionUserDto,
    @Body() body: SyncAnimalSimpleEventRequestDto,
  ): Promise<{ results: any[] }> {
    const results = await this.cattleService.syncCattleSimpleEvents(
      sessionUser.tenant_id,
      sessionUser.sub,
      (body as any).animalSimpleEvent,
    );
    return { results };
  }

  @Post('import')
  @ApiOperation({ summary: 'Import cattle from an Excel file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @RequireAction('create')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(xlsx|xls)$/)) {
          return cb(
            new Error('Only Excel files (.xlsx, .xls) are allowed'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  @ApiResponse({
    status: 201,
    description: 'Cattle imported successfully',
    schema: {
      example: {
        importedCount: 25,
        skippedCount: 2,
        errors: [],
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid file type. Only Excel files are allowed.',
  })
  @ApiResponse({
    status: 422,
    description: 'File processed but contains invalid cattle records.',
    schema: {
      example: {
        importedCount: 20,
        skippedCount: 5,
        errors: [
          { row: 3, error: 'Missing cattle ID' },
          { row: 7, error: 'Invalid weight format' },
        ],
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Unexpected error during import process',
  })
  import(
    @SessionUser() sessionUser: SessionUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.cattleService.import(file, sessionUser.tenant_id);
  }

  @Get('validate-number/:number')
  @RequireAction('read')
  @ApiOperation({
    summary: 'Validate cattle by number for sale (checks ACTIVE status)',
  })
  @ApiResponse({
    status: 200,
    description: 'Cattle is valid and ACTIVE',
    type: CattleResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Cattle not found or not ACTIVE',
  })
  async validateCattleByNumber(
    @Param('number') number: string,
    @SessionUser() user: SessionUserDto,
  ) {
    return this.cattleService.validateCattleByNumber(
      number,
      user.tenant_id,
    );
  }

  @Post(':id/weight-history')
  @RequireAction('update')
  @ApiOperation({ summary: 'Record weight measurement in history' })
  @ApiResponse({
    status: 201,
    description: 'Weight recorded successfully',
  })
  async recordWeightHistory(
    @Param('id') id: string,
    @Body() dto: any,
    @SessionUser() user: SessionUserDto,
  ) {
    return this.cattleService.recordWeightHistory(
      id,
      dto,
      user.tenant_id,
      user.sub,
    );
  }

  @Put(':id/weight')
  @RequireAction('update')
  @ApiOperation({ summary: 'Update cattle current weight' })
  @ApiResponse({
    status: 200,
    description: 'Weight updated successfully',
  })
  async updateCattleWeight(
    @Param('id') id: string,
    @Body() dto: any,
    @SessionUser() user: SessionUserDto,
  ) {
    return this.cattleService.updateCattleWeight(
      id,
      dto.weight,
      user.tenant_id,
    );
  }

  @Put('bulk-status')
  @RequireAction('update')
  @ApiOperation({ summary: 'Bulk update cattle status' })
  @ApiResponse({
    status: 200,
    description: 'Cattle statuses updated successfully',
  })
  async bulkUpdateStatus(
    @Body() dto: any,
    @SessionUser() user: SessionUserDto,
  ) {
    return this.cattleService.bulkUpdateStatus(
      dto.cattleIds,
      dto.status,
      user.tenant_id,
    );
  }
}

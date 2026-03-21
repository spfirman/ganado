import { Controller, Post, Get, Put, Body, Param, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { SimpleEventService } from '../services/simple-event.service';
import { CreateSimpleEventDto } from '../dto/create-simple-event.dto';
import { SyncSimpleEventsRequestDto, SyncSimpleEventsResponseDto } from '../dto/sync-simple-events.dto';
import { SimpleEventResponseDto } from '../dto/simple-event-response.dto';
import { UpdateSimpleEventDto } from '../dto/update-simple-events.dto';
import { AnimalSimpleEventRepository } from '../repositories/animal-simple-event.repository';
import { RequireAction, RequireEntity, RequireModule } from '../../../common/application-permissions/application-permissions.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ApplicationPermissionsGuard } from '../../../common/application-permissions/application-permissions.guard';
import { SessionUser } from '../../../common/decorators/session-user.decorator';
import { SessionUserDto } from '../../auth/dto/session-user.dto';

@ApiTags('Simple Events')
@ApiBearerAuth('access-token')
@Controller('simple-events')
@RequireEntity('simple_events')
@RequireModule('MASSIVE_EVENTS')
@UseGuards(JwtAuthGuard, ApplicationPermissionsGuard)
export class SimpleEventController {
  constructor(
    private readonly simpleEventService: SimpleEventService,
    private readonly simpleEventCattleRepository: AnimalSimpleEventRepository,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new simple event and attach to a massive event' })
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({ status: 201, description: 'Simple event created successfully', type: SimpleEventResponseDto })
  @ApiResponse({ status: 404, description: 'Massive event not found' })
  @RequireAction('create')
  @ApiBody({
    type: CreateSimpleEventDto,
    examples: {
      weight: {
        summary: 'Weight type (data varies per cattle)',
        value: { idMassiveEvent: 'uuid-massive-event', type: 'weight', data: {} },
      },
      eartag: {
        summary: 'Eartag type (can define left/right values)',
        value: { idMassiveEvent: 'uuid-massive-event', type: 'eartag', data: { eartagLeft: 'ET-L-001', eartagRight: 'ET-R-001' } },
      },
      tracker: {
        summary: 'Tracker type (data varies per cattle)',
        value: { idMassiveEvent: 'uuid-massive-event', type: 'tracker', data: {} },
      },
      castration: {
        summary: 'Castration type (data varies per cattle)',
        value: { idMassiveEvent: 'uuid-massive-event', type: 'castration', data: {} },
      },
      brand: {
        summary: 'Brand type (same brand for all cattle)',
        value: { idMassiveEvent: 'uuid-massive-event', type: 'brand', data: { brandId: 'uuid-brand', brandName: 'Brand Name' } },
      },
      medication: {
        summary: 'Medication type (same medication for all cattle)',
        value: {
          idMassiveEvent: 'uuid-massive-event',
          type: 'medication',
          data: { medicationName: 'abc', dosage: '1ml/50kg', route: 'oral', lot: '232adf-asdf' },
        },
      },
    },
  })
  create(
    @SessionUser() sessionUser: SessionUserDto,
    @Body() dto: CreateSimpleEventDto,
  ) {
    return this.simpleEventService.createSimpleEvent(sessionUser.tenant_id, dto);
  }

  @Post('sync')
  @ApiOperation({ summary: 'Sync simple events (offline -> backend)' })
  @ApiResponse({
    status: 201,
    description: 'Simple events synced successfully',
    type: SyncSimpleEventsResponseDto,
  })
  @RequireAction('create')
  @ApiBody({
    type: SyncSimpleEventsRequestDto,
    examples: {
      example1: {
        summary: 'Syncing various simple events',
        value: {
          simpleEvents: [
            { id: 'uuid-se-weight', idMassiveEvent: 'uuid-massive', type: 'weight', dataJson: '{}' },
            { id: 'uuid-se-eartag', idMassiveEvent: 'uuid-massive', type: 'eartag', dataJson: '{"eartagLeft":"ET-L-001","eartagRight":"ET-R-001"}' },
            { id: 'uuid-se-tracker', idMassiveEvent: 'uuid-massive', type: 'tracker', dataJson: '{}' },
            { id: 'uuid-se-brand', idMassiveEvent: 'uuid-massive', type: 'brand', dataJson: '{"idBrand":"brand-777"}' },
            { id: 'uuid-se-castration', idMassiveEvent: 'uuid-massive', type: 'castration' },
            { id: 'uuid-se-medication', idMassiveEvent: 'uuid-massive', type: 'medication', dataJson: '{"medicationName":"med-001","dosage":"1ml","route":"oral","lot":"LOT-2025"}' },
          ],
        },
      },
    },
  })
  async sync(
    @SessionUser() sessionUser: SessionUserDto,
    @Body() dto: SyncSimpleEventsRequestDto,
  ): Promise<SyncSimpleEventsResponseDto> {
    const results = await this.simpleEventService.syncSimpleEvents(sessionUser.tenant_id, dto.simpleEvents);
    return { results };
  }

  @Get('by-massive-event/:idMassiveEvent')
  @ApiOperation({ summary: 'List all simple events by massive event' })
  @ApiResponse({ status: 200, description: 'List of simple events by massive event' })
  @RequireAction('read')
  list(
    @SessionUser() sessionUser: SessionUserDto,
    @Param('idMassiveEvent') idMassiveEvent: string,
  ) {
    return this.simpleEventService.findByMassiveEvent(sessionUser.tenant_id, idMassiveEvent);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a simple event by ID' })
  @ApiResponse({ status: 200, description: 'Simple event found' })
  @ApiResponse({ status: 404, description: 'Simple event not found' })
  @RequireAction('read')
  findById(
    @SessionUser() sessionUser: SessionUserDto,
    @Param('id') id: string,
  ) {
    return this.simpleEventService.findByIdOrFail(sessionUser.tenant_id, id);
  }

  @Get('by-cattle/:id')
  @ApiOperation({ summary: 'List all ids of cattle related to a simple event' })
  @ApiResponse({ status: 200, description: 'List of cattle IDs' })
  @RequireAction('read')
  async getAppliedCattleIdsBySimpleEvent(@Param('id') id: string): Promise<any[]> {
    const links = await this.simpleEventCattleRepository.findBySimpleEvent(id);
    return links.map((link) => ({
      idCattle: link.idAnimal,
      appliedAt: link.appliedAt,
      appliedBy: link.appliedBy,
    }));
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a simple event' })
  @ApiResponse({ status: 200, description: 'Simple event updated successfully' })
  @ApiResponse({ status: 404, description: 'Simple event not found' })
  @RequireAction('update')
  update(
    @SessionUser() sessionUser: SessionUserDto,
    @Param('id') id: string,
    @Body() dto: UpdateSimpleEventDto,
  ) {
    return this.simpleEventService.updateSimpleEvent(sessionUser.tenant_id, id, dto);
  }
}

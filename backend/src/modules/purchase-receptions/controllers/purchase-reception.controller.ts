import { Controller, Get, Post, Put, Patch, Body, Param, Query, HttpCode, HttpStatus, UseGuards, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { RequireAction, RequireEntity, RequireModule } from '../../../common/application-permissions/application-permissions.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ApplicationPermissionsGuard } from '../../../common/application-permissions/application-permissions.guard';
import { SessionUser } from '../../../common/decorators/session-user.decorator';
import { SessionUserDto } from '../../auth/dto/session-user.dto';
import { ReceptionsService } from '../services/receptions.service';
import { ReceptionResponseDto } from '../dto/reception-response.dto';
import { ReceiveCattleRequestDto, UpdateLotCattleRequestDto } from '../dto/receive-cattle-request.dto';
import { ReceiveCattleResponseDto } from '../dto/receive-cattle-response.dto';
import { CattleStatus, Cattle } from '../../farm/entities/cattle.entity';
import { Device } from '../../production-center/entities/device.entity';
import { CattleService } from '../../farm/services/cattle.service';
import { SimpleEvent } from '../../massive-events/entities/simple-event.entity';
import { SimpleEventService } from '../../massive-events/services/simple-event.service';
import { UpdateSimpleEventDto } from '../../massive-events/dto/update-simple-events.dto';
import { PurchaseResponseDto } from '../../commerce/dto/purchase-response.dto';
import { UpdatePurchaseStatusDto } from '../../commerce/dto/update-purchase-status.dto';
import { PurchaseService } from '../../commerce/services/purchase.service';

@ApiTags('Purchase reception')
@ApiBearerAuth('access-token')
@Controller('purchase-receptions')
@RequireEntity('receptions')
@RequireModule('RECEPTION')
@UseGuards(JwtAuthGuard, ApplicationPermissionsGuard)
export class ReceptionController {
  constructor(
    private readonly receptionsService: ReceptionsService,
    private readonly cattleService: CattleService,
    private readonly simpleEventService: SimpleEventService,
    private readonly purchaseService: PurchaseService,
  ) {}

  @Get('number-exists')
  @RequireAction('read')
  async numberExists(
    @SessionUser() sessionUser: SessionUserDto,
    @Query('number') number: string,
  ): Promise<{ exists: boolean }> {
    if (!number?.trim()) {
      throw new BadRequestException('number is required');
    }
    const cattle = await this.cattleService.findByNumber(sessionUser.tenant_id, number.trim());
    const exists = !!cattle && (cattle.status === CattleStatus.ACTIVE || cattle.status === CattleStatus.LOST);
    return { exists };
  }

  @Get('eartag-exists')
  @RequireAction('read')
  async eartagExists(
    @SessionUser() sessionUser: SessionUserDto,
    @Query('eartag') eartag: string,
  ): Promise<{ exists: boolean }> {
    if (!eartag?.trim()) {
      throw new BadRequestException('eartag is required');
    }
    var cattle = await this.cattleService.findByAnyEartag(sessionUser.tenant_id, eartag.trim());
    const exists = !!cattle && (cattle.status === CattleStatus.ACTIVE || cattle.status === CattleStatus.LOST);
    return { exists };
  }

  @Get(':idPurchase')
  @ApiOperation({ summary: 'Find or create a reception by purchase id' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: 'Reception found or created successfully', type: ReceptionResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid request body' })
  @RequireAction('create')
  async findOrCreateReception(
    @SessionUser() sessionUser: SessionUserDto,
    @Param('idPurchase') idPurchase: string,
  ): Promise<ReceptionResponseDto> {
    console.log('idPurchase - controller', idPurchase);
    const receptionInfo = await this.receptionsService.findOrCreateReceptionByIdPurchase(
      sessionUser.tenant_id,
      idPurchase,
      sessionUser.sub,
    );
    const receptionResponseDto = ReceptionResponseDto.toResponseDto(receptionInfo);
    return receptionResponseDto;
  }

  @Get('search-devices/by-query')
  @ApiOperation({ summary: 'Search devices by name or deveui' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: 'Devices found', type: [Device] })
  @RequireAction('read')
  async searchDevices(
    @SessionUser() sessionUser: SessionUserDto,
    @Query('q') q: string,
  ): Promise<Device[]> {
    return this.receptionsService.searchDevices(sessionUser.tenant_id, q);
  }

  @Post('receive-cattle')
  @ApiOperation({ summary: 'Receive cattle to a reception' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: 'Cattle received successfully', type: ReceiveCattleResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid request body' })
  @RequireAction('create')
  @ApiBody({
    type: ReceiveCattleRequestDto,
    examples: {
      ReceiveCattleRequestDto: {
        value: {
          number: 'C-001',
          receivedWeight: 250.5,
          idPurchase: 'uuid-purchase-123',
          purchaseWeight: 254.0,
          purchasePrice: 1900000,
          idLot: 'uuid-lot-456',
          idBrand: 'uuid-brand-789',
          color: 'color_enum',
          characteristicsIds: ['char_enum_1', 'char_enum_2'],
          eartagLeft: 'ET-12345',
          eartagRight: 'ET-12346',
          idDevice: 'uuid-device-999',
          castrated: true,
          hasHorn: true,
          birthDateAprx: '2024-01-15',
          gender: 'gender_enum',
          comments: 'Initial reception check completed.',
          idProvider: 'uuid-provider-123',
          idSimpleEvents: ['uuid-simple-event-1', 'uuid-simple-event-2'],
        },
      },
    },
  })
  async receiveCattle(
    @SessionUser() sessionUser: SessionUserDto,
    @Body() dto: ReceiveCattleRequestDto,
  ): Promise<ReceiveCattleResponseDto> {
    console.log('dto - controller', dto);
    return this.receptionsService.receiveCattle_Transaction(sessionUser.tenant_id, sessionUser.sub, dto);
  }

  @Patch('assign-lot-cattle')
  @ApiOperation({ summary: 'Assign a lot to a cattle' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: 'Cattle updated successfully', type: Cattle })
  @ApiResponse({ status: 400, description: 'Invalid request body' })
  @RequireAction('update')
  @ApiBody({
    type: UpdateLotCattleRequestDto,
    examples: {
      UpdateLotCattleRequestDto: {
        value: {
          idCattle: 'uuid-cattle-123',
          idLot: 'uuid-lot-456',
        },
      },
    },
  })
  async assignLotCattle(
    @SessionUser() sessionUser: SessionUserDto,
    @Body() dto: UpdateLotCattleRequestDto,
  ): Promise<any> {
    return this.receptionsService.assignLotCattle(sessionUser.tenant_id, dto);
  }

  @Get('next-number/:number')
  @ApiOperation({ summary: 'Get the next number for a reception' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: 'Next number found successfully', type: Number })
  @RequireAction('read')
  async nextNumber(
    @SessionUser() sessionUser: SessionUserDto,
    @Param('number') number: string,
  ): Promise<any> {
    return this.receptionsService.nextNumber(sessionUser.tenant_id, number);
  }

  @Patch('purchase-status/:id')
  @RequireAction('update')
  @ApiOperation({ summary: 'Update purchase status' })
  @ApiResponse({ status: 200, type: PurchaseResponseDto })
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdatePurchaseStatusDto,
    @SessionUser() user: SessionUserDto,
  ): Promise<PurchaseResponseDto> {
    const purchase = await this.purchaseService.updateStatus(id, dto.status, user.tenant_id, user.sub);
    return PurchaseResponseDto.toPurchaseResponse(purchase);
  }

  @Put('update-simple-event/:id')
  @ApiOperation({ summary: 'Update Reception simple event' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: 'Simple event updated successfully', type: SimpleEvent })
  @ApiResponse({ status: 400, description: 'Invalid request body' })
  @RequireAction('update')
  @ApiBody({
    type: UpdateSimpleEventDto,
    examples: {
      UpdateSimpleEventDto: {
        value: {
          data: { brandId: 'uuid-brand', brandName: 'Brand Name' },
          isActive: true,
        },
      },
    },
  })
  async updateSimpleEvent(
    @SessionUser() sessionUser: SessionUserDto,
    @Param('id') id: string,
    @Body() dto: UpdateSimpleEventDto,
  ): Promise<SimpleEvent> {
    return this.simpleEventService.updateSimpleEvent(sessionUser.tenant_id, id, dto);
  }
}

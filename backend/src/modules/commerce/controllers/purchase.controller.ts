import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { PurchaseService } from '../services/purchase.service';
import { CreatePurchaseDto } from '../dto/create-purchase.dto';
import { UpdatePurchaseDto } from '../dto/update-purchase.dto';
import { SessionUser } from '../../../common/decorators/session-user.decorator';
import { SessionUserDto } from '../../auth/dto/session-user.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ApplicationPermissionsGuard } from '../../../common/application-permissions/application-permissions.guard';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { PurchaseResponseDto } from '../dto/purchase-response.dto';
import {
  RequireAction,
  RequireEntity,
  RequireModule,
} from '../../../common/application-permissions/application-permissions.decorator';
import { PagedResponseDto } from '../../../shared/dto/paged-response.dto';
import { PurchaseListQueryDto } from '../dto/purchase-list.query.dto';

@ApiTags('Purchases')
@ApiBearerAuth('access-token')
@Controller('purchases')
@RequireEntity('purchases')
@RequireModule('COMMERCE')
@UseGuards(JwtAuthGuard, ApplicationPermissionsGuard)
export class PurchaseController {
  private readonly logger = new Logger(PurchaseController.name);

  constructor(private readonly purchaseService: PurchaseService) {}

  @Post()
  @RequireAction('create')
  @ApiOperation({ summary: 'Create a new purchase' })
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({ status: 201, type: PurchaseResponseDto })
  async createPurchase(
    @Body() dto: CreatePurchaseDto,
    @SessionUser() user: SessionUserDto,
  ): Promise<PurchaseResponseDto> {
    const purchase = await this.purchaseService.createPurchase(dto, user.tenant_id, user.sub);
    return PurchaseResponseDto.toPurchaseResponse(purchase);
  }

  @Patch(':id')
  @RequireAction('update')
  @ApiOperation({ summary: 'Update an existing purchase' })
  @ApiResponse({ status: 200, type: PurchaseResponseDto })
  async updatePurchase(
    @Param('id') id: string,
    @Body() dto: UpdatePurchaseDto,
    @SessionUser() user: SessionUserDto,
  ): Promise<PurchaseResponseDto> {
    const purchase = await this.purchaseService.updatePurchase(id, dto, user.tenant_id, user.sub);
    return PurchaseResponseDto.toPurchaseResponse(purchase);
  }

  @Get()
  @RequireAction('read')
  @ApiOperation({ summary: 'List purchases for tenant' })
  @ApiOkResponse({ type: PagedResponseDto })
  async list(
    @SessionUser() user: SessionUserDto,
    @Query() q: PurchaseListQueryDto,
  ): Promise<PagedResponseDto<any>> {
    this.logger.debug('COMPRAS FILTRADAS ');
    const { items, total, page, limit } = await this.purchaseService.listPaged(
      user.tenant_id,
      q,
    );
    const resp = PagedResponseDto.of(page, limit, total, items);
    this.logger.debug(resp);
    return resp;
  }

  @Get(':id')
  @RequireAction('read')
  @ApiOperation({ summary: 'Get a purchase by ID' })
  @ApiResponse({ status: 200, type: PurchaseResponseDto })
  async findById(
    @Param('id') id: string,
    @SessionUser() user: SessionUserDto,
  ): Promise<PurchaseResponseDto> {
    return PurchaseResponseDto.toPurchaseResponse(
      await this.purchaseService.findById(id, user.tenant_id),
    );
  }

  @Delete(':id')
  @RequireAction('delete')
  @ApiOperation({ summary: 'Delete a purchase by ID' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({ status: 204 })
  async deleteById(
    @Param('id') id: string,
    @SessionUser() user: SessionUserDto,
  ): Promise<void> {
    await this.purchaseService.deleteById(id, user.tenant_id);
  }
}

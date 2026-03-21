import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { SalesService } from '../services/sales.service';
import { CreateSaleDto } from '../dto/create-sale.dto';
import { GetSalesQueryDto } from '../dto/get-sales-query.dto';
import { UpdateSaleDto } from '../dto/update-sale.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { SessionUser } from '../../../common/decorators/session-user.decorator';
import { SessionUserDto } from '../../auth/dto/session-user.dto';
import { ApplicationPermissionsGuard } from '../../../common/application-permissions/application-permissions.guard';
import {
  RequireAction,
  RequireEntity,
  RequireModule,
} from '../../../common/application-permissions/application-permissions.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Sales')
@ApiBearerAuth('access-token')
@Controller('sales')
@RequireEntity('sales')
@RequireModule('COMMERCE')
@UseGuards(JwtAuthGuard, ApplicationPermissionsGuard)
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  @RequireAction('create')
  @ApiOperation({ summary: 'Create a new Sale' })
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createSaleDto: CreateSaleDto,
    @SessionUser() user: SessionUserDto,
  ): Promise<any> {
    createSaleDto.idTenant = user.tenant_id;
    createSaleDto.createdBy = user.sub;
    return await this.salesService.createSale(createSaleDto);
  }

  @Get()
  @RequireAction('read')
  async findAll(
    @Query() query: GetSalesQueryDto,
    @SessionUser() user: SessionUserDto,
  ): Promise<any> {
    return await this.salesService.findAll(user.tenant_id, query);
  }

  @Get(':id')
  @RequireAction('read')
  async findOne(
    @Param('id') id: string,
    @SessionUser() user: SessionUserDto,
  ): Promise<any> {
    return await this.salesService.findOne(user.tenant_id, id);
  }

  @Put(':id')
  @RequireAction('update')
  async update(
    @Param('id') id: string,
    @Body() updateSaleDto: UpdateSaleDto,
    @SessionUser() user: SessionUserDto,
  ): Promise<any> {
    return await this.salesService.update(user.tenant_id, id, updateSaleDto);
  }
}

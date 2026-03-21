import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  Request,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { WeighingService } from '../services/weighing.service';
import {
  CreateWeighingDto,
  UpdateWeighingDto,
  WeighingQueryDto,
  BatchSyncWeighingDto,
} from '../dto/create-weighing.dto';
import { RegisterDeviceDto, DeviceHeartbeatDto } from '../dto/bridge-device.dto';
import { WeighingMediaType } from '../enums/weighing-source.enum';

@ApiTags('Hardware Integration')
@Controller()
export class WeighingController {
  constructor(private readonly weighingService: WeighingService) {}

  // ─── Weighing Endpoints ───────────────────────────────────────────────────

  @Post('weighings')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new weighing record' })
  @ApiResponse({ status: 201, description: 'Weighing record created' })
  async createWeighing(@Request() req: any, @Body() dto: CreateWeighingDto) {
    return this.weighingService.createWeighing(
      req.user.tenant_id,
      dto,
      req.user.sub,
    );
  }

  @Get('weighings')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List weighing records with filters' })
  async listWeighings(@Request() req: any, @Query() query: WeighingQueryDto) {
    return this.weighingService.listWeighings(req.user.tenant_id, query);
  }

  @Get('weighings/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a single weighing record with media' })
  async getWeighing(@Request() req: any, @Param('id', ParseUUIDPipe) id: string) {
    return this.weighingService.getWeighing(req.user.tenant_id, id);
  }

  @Patch('weighings/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update/correct a weighing record (creates audit trail)' })
  async updateWeighing(
    @Request() req: any,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateWeighingDto,
  ) {
    return this.weighingService.updateWeighing(
      req.user.tenant_id,
      id,
      dto,
      req.user.sub,
    );
  }

  @Post('weighings/:id/media')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload photo/video to a weighing record' })
  async uploadMedia(
    @Request() req: any,
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFile() file: any,
    @Body('type') type: WeighingMediaType,
  ) {
    // In production, upload to S3 and store URL
    // For now, store locally
    const url = `/uploads/weighings/${id}/${file?.originalname || 'media'}`;
    return this.weighingService.addMedia(req.user.tenant_id, id, {
      type: type || WeighingMediaType.MANUAL_UPLOAD,
      url,
      fileSizeBytes: file?.size || null,
      capturedAt: new Date(),
    });
  }

  // ─── Batch Sync (Bridge offline queue) ────────────────────────────────────

  @Post('bridge/sync')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Batch sync offline weighing records from bridge' })
  async batchSync(@Request() req: any, @Body() dto: BatchSyncWeighingDto) {
    return this.weighingService.batchSync(
      req.user.tenant_id,
      dto,
      req.user.sub,
    );
  }

  // ─── EID Lookup ───────────────────────────────────────────────────────────

  @Get('cattle/by-eid/:eid')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Look up cattle by 15-digit RFID EID tag number' })
  @ApiResponse({ status: 200, description: 'Cattle found' })
  @ApiResponse({ status: 404, description: 'No cattle found with this EID' })
  async findCattleByEid(@Request() req: any, @Param('eid') eid: string) {
    const cattle = await this.weighingService.findCattleByEid(
      req.user.tenant_id,
      eid,
    );
    if (!cattle) {
      return { found: false, eid, message: 'No cattle found with this EID tag' };
    }
    return { found: true, eid, cattle };
  }

  // ─── Bridge Device Management ─────────────────────────────────────────────

  @Post('bridge/devices/register')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Register a new bridge/hardware device' })
  @ApiResponse({ status: 201, description: 'Device registered with API key' })
  async registerDevice(@Request() req: any, @Body() dto: RegisterDeviceDto) {
    return this.weighingService.registerDevice(req.user.tenant_id, dto);
  }

  @Get('bridge/devices')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all registered hardware devices' })
  async listDevices(@Request() req: any) {
    return this.weighingService.listDevices(req.user.tenant_id);
  }

  @Post('bridge/devices/:id/heartbeat')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Bridge device heartbeat (no JWT needed, uses API key)' })
  async deviceHeartbeat(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: DeviceHeartbeatDto,
    @Query('apiKey') apiKey: string,
  ) {
    return this.weighingService.deviceHeartbeat(id, apiKey);
  }

  @Delete('bridge/devices/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Revoke/delete a registered device' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async revokeDevice(@Request() req: any, @Param('id', ParseUUIDPipe) id: string) {
    return this.weighingService.revokeDevice(req.user.tenant_id, id);
  }

  // ─── Bridge Status ────────────────────────────────────────────────────────

  @Get('bridge/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get bridge status and configuration' })
  async getBridgeStatus(@Request() req: any) {
    const devices = await this.weighingService.listDevices(req.user.tenant_id);
    return {
      devices: devices.map(d => ({
        id: d.id,
        name: d.name,
        type: d.type,
        status: d.status,
        lastSeenAt: d.lastSeenAt,
        ipAddress: d.ipAddress,
      })),
      pollIntervalMs: 30000,
      timestamp: new Date().toISOString(),
    };
  }
}

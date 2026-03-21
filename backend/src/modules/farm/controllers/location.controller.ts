import {
  Controller,
  Get,
  Delete,
  Param,
  UseGuards,
} from '@nestjs/common';
import { LocationService } from '../services/location.service';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { Location } from '../entities/location.entity';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ApplicationPermissionsGuard } from '../../../common/application-permissions/application-permissions.guard';
import { RequireEntity, RequireModule } from '../../../common/application-permissions/application-permissions.decorator';
import { SessionUserDto } from '../../auth/dto/session-user.dto';
import { SessionUser } from '../../../common/decorators/session-user.decorator';

@ApiTags('Locations')
@ApiBearerAuth('access-token')
@Controller('locations')
@RequireEntity('locations')
@RequireModule('FARM')
@UseGuards(JwtAuthGuard, ApplicationPermissionsGuard)
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get a location by ID' })
  @ApiResponse({
    status: 200,
    description: 'Location found',
    type: Location,
  })
  findOne(@Param('id') id: string) {
    return this.locationService.findOne(id);
  }

  @Get('cattle/:id')
  @ApiOperation({ summary: 'Get a location by cattle ID' })
  @ApiResponse({
    status: 200,
    description: 'Location found',
    type: Location,
  })
  findByCattle(
    @Param('id') id: string,
    @SessionUser() sessionUser: SessionUserDto,
  ) {
    return this.locationService.findByCattle(id, sessionUser.tenant_id);
  }

  @Get('device/:id')
  @ApiOperation({ summary: 'Get a location by device ID' })
  @ApiResponse({
    status: 200,
    description: 'Location found',
    type: Location,
  })
  findByDevice(
    @Param('id') id: string,
    @SessionUser() sessionUser: SessionUserDto,
  ) {
    return this.locationService.findByDevice(id, sessionUser.tenant_id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a location' })
  @ApiResponse({
    status: 200,
    description: 'Location deleted successfully',
  })
  remove(@Param('id') id: string) {
    return this.locationService.remove(id);
  }
}

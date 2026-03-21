import {
  Controller,
  Get,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { RequireAction, RequireEntity, RequireModule } from '../../../common/application-permissions/application-permissions.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ApplicationPermissionsGuard } from '../../../common/application-permissions/application-permissions.guard';
import { SessionUser } from '../../../common/decorators/session-user.decorator';
import { SessionUserDto } from '../../auth/dto/session-user.dto';
import { ColorCharacteristicsService } from '../services/color-characteristics.service';

@ApiTags('Color-Characteristics')
@ApiBearerAuth('access-token')
@Controller('color-characteristics')
@RequireEntity('cattle')
@RequireModule('FARM')
@UseGuards(JwtAuthGuard, ApplicationPermissionsGuard)
export class ColorCharacteristicsController {
  constructor(
    private readonly colorCharacteristicsService: ColorCharacteristicsService,
  ) {}

  @Get('color')
  @ApiOperation({ summary: 'Get all colors' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    description: 'Colors retrieved successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid request body' })
  @RequireAction('read')
  getAllColors(@SessionUser() sessionUser: SessionUserDto) {
    return this.colorCharacteristicsService.getAllColors();
  }

  @Get('characteristic')
  @ApiOperation({ summary: 'Get all characteristics' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    description: 'Characteristics retrieved successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid request body' })
  @RequireAction('read')
  getAllCharacteristics(@SessionUser() sessionUser: SessionUserDto) {
    return this.colorCharacteristicsService.getAllCharacteristics();
  }
}

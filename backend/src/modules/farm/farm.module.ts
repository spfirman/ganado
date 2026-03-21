import { Module, forwardRef } from '@nestjs/common';
import { CommerceModule } from '../commerce/commerce.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cattle } from './entities/cattle.entity';
import { CattleRepository } from './repositories/cattle.repository';
import { CattleService } from './services/cattle.service';
import { CattleController } from './controllers/cattle.controller';
import { ConfigModule } from '@nestjs/config';
import { ApplicationPermissionsModule } from '../../common/application-permissions/application-permissions.module';
import { CattleDeviceHistory } from './entities/cattle-device-history.entity';
import { CattleDeviceHistoryRepository } from './repositories/cattle-device-history.repository';
import { CattleWeightHistory } from './entities/cattle-weight-history.entity';
import { CattleWeightHistoryRepository } from './repositories/cattle-weight-history.repository';
import { CattleEartagHistory } from './entities/cattle-eartag-history.entity';
import { CattleEartagHistoryRepository } from './repositories/cattle-eartag-history.repository';
import { CattleMedicationHistory } from './entities/cattle-medication-history.entity';
import { CattleMedicationHistoryRepository } from './repositories/cattle-medication-history.repository';
import { ProductionCenterModule } from '../production-center/production-center.module';
import { Location } from './entities/location.entity';
import { LocationService } from './services/location.service';
import { LocationRepository } from './repositories/location.repository';
import { LocationController } from './controllers/location.controller';
import { MassiveEventsModule } from '../massive-events/massive-events.module';
import { BrandController } from './controllers/brand.controller';
import { BrandRepository } from './repositories/brand.repository';
import { BrandService } from './services/brand.service';
import { Brand } from './entities/brand.entity';
import { CattleCharacteristicRepository } from './repositories/cattle-characteristic.repository';
import { CattleCharacteristic } from './entities/cattle-characteristic.entity';
import { ColorCharacteristicsService } from './services/color-characteristics.service';
import { ColorCharacteristicsController } from './controllers/color-characteristics.controller';
import { ConfigurationModule } from '../configurations/configuration.module';

@Module({
  imports: [
    forwardRef(() => MassiveEventsModule),
    forwardRef(() => CommerceModule),
    ConfigurationModule,
    TypeOrmModule.forFeature([
      Cattle,
      CattleCharacteristic,
      CattleDeviceHistory,
      CattleWeightHistory,
      CattleEartagHistory,
      CattleMedicationHistory,
      Location,
      Brand,
    ]),
    ConfigModule,
    ApplicationPermissionsModule,
    ProductionCenterModule,
  ],
  providers: [
    CattleRepository,
    CattleService,
    CattleDeviceHistoryRepository,
    CattleWeightHistoryRepository,
    CattleEartagHistoryRepository,
    CattleMedicationHistoryRepository,
    CattleCharacteristicRepository,
    LocationService,
    LocationRepository,
    BrandRepository,
    BrandService,
    ColorCharacteristicsService,
  ],
  controllers: [
    BrandController,
    ColorCharacteristicsController,
    CattleController,
    LocationController,
  ],
  exports: [
    ColorCharacteristicsService,
    CattleService,
    LocationService,
    CattleRepository,
    CattleDeviceHistoryRepository,
    CattleWeightHistoryRepository,
    CattleCharacteristicRepository,
  ],
})
export class FarmModule {}

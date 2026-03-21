import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationPermissionsModule } from '../../common/application-permissions/application-permissions.module';
import { CommerceModule } from '../commerce/commerce.module';
import { MassiveEventsModule } from '../massive-events/massive-events.module';
import { FarmModule } from '../farm/farm.module';
import { ConfigurationModule } from '../configurations/configuration.module';
import { PurchaseReception } from './entities/purchase-reception.entity';
import { Device } from '../production-center/entities/device.entity';
import { PurchaseReceptionRepository } from './repositories/purchase-reception.repository';
import { ReceptionsService } from './services/receptions.service';
import { ReceptionController } from './controllers/purchase-reception.controller';
import { ProductionCenterModule } from '../production-center/production-center.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PurchaseReception, Device]),
    ApplicationPermissionsModule,
    CommerceModule,
    MassiveEventsModule,
    FarmModule,
    ConfigurationModule,
    ProductionCenterModule,
  ],
  controllers: [ReceptionController],
  providers: [ReceptionsService, PurchaseReceptionRepository],
  exports: [ReceptionsService, PurchaseReceptionRepository],
})
export class ReceptionModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Weighing } from './entities/weighing.entity';
import { WeighingMedia } from './entities/weighing-media.entity';
import { WeighingAuditLog } from './entities/weighing-audit-log.entity';
import { BridgeDevice } from './entities/bridge-device.entity';
import { Cattle } from '../farm/entities/cattle.entity';
import { CattleWeightHistory } from '../farm/entities/cattle-weight-history.entity';
import { WeighingService } from './services/weighing.service';
import { WeighingController } from './controllers/weighing.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Weighing,
      WeighingMedia,
      WeighingAuditLog,
      BridgeDevice,
      Cattle,
      CattleWeightHistory,
    ]),
    AuthModule,
  ],
  controllers: [WeighingController],
  providers: [WeighingService],
  exports: [WeighingService],
})
export class HardwareIntegrationModule {}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeManagementModule } from './modules/employee-management/employee-management.module';
import { AuthModule } from './modules/auth/auth.module';
import { typeOrmConfig } from './config/typeorm.config';
import { ProductionCenterModule } from './modules/production-center/production-center.module';
import { FarmModule } from './modules/farm/farm.module';
import { MqttModule } from './modules/mqtt/mqtt.module';
import { CommerceModule } from './modules/commerce/commerce.module';
import { ReceptionModule } from './modules/purchase-receptions/reception.module';
import { ConfigurationModule } from './modules/configurations/configuration.module';
import { AiTestingModule } from './modules/ai-testing/ai-testing.module';
import { I18nModule } from './modules/i18n/i18n.module';
import { HardwareIntegrationModule } from './modules/hardware-integration/hardware-integration.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
    AuthModule,
    EmployeeManagementModule,
    ProductionCenterModule,
    FarmModule,
    CommerceModule,
    ReceptionModule,
    ConfigurationModule,
    MqttModule,
    AiTestingModule,
    I18nModule,
    HardwareIntegrationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

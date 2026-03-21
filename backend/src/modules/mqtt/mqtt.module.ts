import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MqttController } from './mqtt.controller';
import { MqttService } from './mqtt.service';
import { FarmModule } from '../farm/farm.module';

@Module({
  imports: [ConfigModule, FarmModule],
  controllers: [MqttController],
  providers: [MqttService],
  exports: [MqttService],
})
export class MqttModule {}

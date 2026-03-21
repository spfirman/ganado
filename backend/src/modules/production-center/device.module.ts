import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { Device } from './entities/device.entity';
import { DeviceProfile } from './entities/device-profile.entity';
import { DevicesController } from './controllers/devices.controller';
import { DeviceProfilesController } from './controllers/device-profiles.controller';
import { DevicesService } from './services/devices.service';
import { DeviceProfilesService } from './services/device-profiles.service';
import { DeviceRepository } from './repositories/device.repository';
import { DeviceProfileRepository } from './repositories/device-profile.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Device, DeviceProfile]),
    HttpModule,
    ConfigModule,
  ],
  controllers: [DevicesController, DeviceProfilesController],
  providers: [DevicesService, DeviceProfilesService, DeviceRepository, DeviceProfileRepository],
  exports: [DevicesService, DeviceProfilesService],
})
export class DeviceModule {}

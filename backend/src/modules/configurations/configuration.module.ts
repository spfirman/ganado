import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Configuration } from './entities/configuration.entity';
import { ConfigurationsRepository } from './repositories/configurations.repository';
import { ConfigurationsService } from './services/configurations.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Configuration]),
  ],
  providers: [ConfigurationsRepository, ConfigurationsService],
  exports: [ConfigurationsRepository, ConfigurationsService],
})
export class ConfigurationModule {}

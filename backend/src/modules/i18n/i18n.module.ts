import { Module } from '@nestjs/common';
import { I18nService } from './i18n.service';
import { I18nController } from './i18n.controller';
import { MetaController } from './meta.controller';

@Module({
  controllers: [I18nController, MetaController],
  providers: [I18nService],
  exports: [I18nService],
})
export class I18nModule {}

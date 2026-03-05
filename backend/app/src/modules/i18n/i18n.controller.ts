import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { I18nService } from './i18n.service';

@ApiTags('i18n')
@Controller('i18n')
export class I18nController {
  constructor(private readonly i18nService: I18nService) {}

  @Get('languages')
  @ApiOperation({ summary: 'Get supported languages' })
  getLanguages() {
    return {
      success: true,
      data: this.i18nService.getSupportedLocales(),
    };
  }

  @Get('translations')
  @ApiOperation({ summary: 'Get translations for a locale' })
  getTranslations(@Query('locale') locale: string = 'es') {
    return {
      success: true,
      data: {
        locale,
        translations: this.i18nService.getTranslations(locale),
      },
    };
  }
}

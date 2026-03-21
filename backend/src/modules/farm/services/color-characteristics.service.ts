import { Injectable } from '@nestjs/common';
import { CattleColor } from '../enums/cattle-color.enum';
import { CattleCharacteristicEnum } from '../enums/cattle-characteristic.enum';

@Injectable()
export class ColorCharacteristicsService {
  constructor() {}

  getAllColors(): string[] {
    return Object.values(CattleColor);
  }

  getAllCharacteristics(): string[] {
    return Object.values(CattleCharacteristicEnum);
  }
}

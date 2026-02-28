import { CattleColor } from "../enums/cattle-color.enum";
import { CattleCharacteristicEnum } from "../enums/cattle-characteristic.enum";
export declare class ColorCharacteristicsService {
    constructor();
    getAllColors(): CattleColor[];
    getAllCharacteristics(): CattleCharacteristicEnum[];
}

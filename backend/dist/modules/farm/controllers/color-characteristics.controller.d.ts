import { SessionUserDto } from 'src/modules/auth/dto/session-user.dto';
import { ColorCharacteristicsService } from "../services/color-characteristics.service";
export declare class ColorCharacteristicsController {
    private readonly colorCharacteristicsService;
    constructor(colorCharacteristicsService: ColorCharacteristicsService);
    getAllColors(sessionUser: SessionUserDto): import("../enums/cattle-color.enum").CattleColor[];
    getAllCharacteristics(sessionUser: SessionUserDto): import("../enums/cattle-characteristic.enum").CattleCharacteristicEnum[];
}

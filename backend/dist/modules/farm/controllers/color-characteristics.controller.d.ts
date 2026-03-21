import { SessionUserDto } from '../../auth/dto/session-user.dto';
import { ColorCharacteristicsService } from '../services/color-characteristics.service';
export declare class ColorCharacteristicsController {
    private readonly colorCharacteristicsService;
    constructor(colorCharacteristicsService: ColorCharacteristicsService);
    getAllColors(sessionUser: SessionUserDto): string[];
    getAllCharacteristics(sessionUser: SessionUserDto): string[];
}

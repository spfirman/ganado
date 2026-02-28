import { Tenant } from '../../employee-management/entities/tenant.entity';
import { Cattle } from './cattle.entity';
import { CattleCharacteristicEnum } from '../enums/cattle-characteristic.enum';
export declare class CattleCharacteristic {
    id: string;
    idTenant: Tenant;
    idCattle: string;
    cattle: Cattle;
    characteristic: CattleCharacteristicEnum;
    createdAt: Date;
}

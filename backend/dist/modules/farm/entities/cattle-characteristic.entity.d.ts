import { Tenant } from '../../employee-management/entities/tenant.entity';
import { Cattle } from './cattle.entity';
export declare class CattleCharacteristic {
    id: string;
    idTenant: Tenant;
    idCattle: string;
    cattle: Cattle;
    characteristic: string;
    createdAt: Date;
}

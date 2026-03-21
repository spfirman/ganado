"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CattleCharacteristicRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const cattle_characteristic_entity_1 = require("../entities/cattle-characteristic.entity");
let CattleCharacteristicRepository = class CattleCharacteristicRepository extends typeorm_1.Repository {
    constructor(dataSource) {
        super(cattle_characteristic_entity_1.CattleCharacteristic, dataSource.createEntityManager());
        this.dataSource = dataSource;
    }
    async attachMany(cattleId, tenantId, characteristicIds, manager) {
        const m = manager ?? this.manager;
        if (!characteristicIds?.length)
            return;
        const rows = characteristicIds.map((char) => m.create(cattle_characteristic_entity_1.CattleCharacteristic, {
            idTenant: { id: tenantId },
            cattle: { id: cattleId },
            characteristic: char,
        }));
        await m
            .createQueryBuilder()
            .insert()
            .into(cattle_characteristic_entity_1.CattleCharacteristic)
            .values(rows)
            .orIgnore()
            .execute();
    }
    async detachMany(cattleId, characteristicIds, manager) {
        const m = manager ?? this.manager;
        if (!characteristicIds?.length)
            return;
        await m
            .createQueryBuilder()
            .delete()
            .from(cattle_characteristic_entity_1.CattleCharacteristic)
            .where('id_cattle = :cattleId', { cattleId })
            .andWhere('characteristic = ANY(:ids)', { ids: characteristicIds })
            .execute();
    }
    async replaceAll(cattleId, tenantId, characteristicIds, manager) {
        const m = manager ?? this.manager;
        await m
            .createQueryBuilder()
            .delete()
            .from(cattle_characteristic_entity_1.CattleCharacteristic)
            .where('id_cattle = :cattleId', { cattleId })
            .execute();
        await this.attachMany(cattleId, tenantId, characteristicIds, m);
    }
};
exports.CattleCharacteristicRepository = CattleCharacteristicRepository;
exports.CattleCharacteristicRepository = CattleCharacteristicRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], CattleCharacteristicRepository);
//# sourceMappingURL=cattle-characteristic.repository.js.map
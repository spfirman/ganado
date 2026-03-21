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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigurationsRepository = void 0;
const configuration_entity_1 = require("../entities/configuration.entity");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const common_1 = require("@nestjs/common");
let ConfigurationsRepository = class ConfigurationsRepository {
    constructor(repository) {
        this.repository = repository;
    }
    async createTenantDefaults(idTenant, manager) {
        const configurationRepository = manager?.getRepository(configuration_entity_1.Configuration) || this.repository;
        const configurations = [];
        const nextCattleSysNumberConfig = new configuration_entity_1.Configuration();
        nextCattleSysNumberConfig.idTenant = idTenant;
        nextCattleSysNumberConfig.code = 'next_cattle_sysnumber';
        nextCattleSysNumberConfig.isSystemConfig = true;
        nextCattleSysNumberConfig.name = 'Next Cattle SysNumber';
        nextCattleSysNumberConfig.value = '1';
        nextCattleSysNumberConfig.valueType = 'number';
        nextCattleSysNumberConfig.description = 'Next sysnumber assignment for new cattle';
        configurations.push(nextCattleSysNumberConfig);
        const averageDailyGainConfig = new configuration_entity_1.Configuration();
        averageDailyGainConfig.idTenant = idTenant;
        averageDailyGainConfig.code = 'average_daily_gain';
        averageDailyGainConfig.isSystemConfig = true;
        averageDailyGainConfig.name = 'Average Daily Gain (kg)';
        averageDailyGainConfig.value = '0.462';
        averageDailyGainConfig.valueType = 'number';
        averageDailyGainConfig.description = 'Average daily gain  in kg for new cattle';
        configurations.push(averageDailyGainConfig);
        return configurationRepository.save(configurations);
    }
    async create(idTenant, configuration, manager) {
        const configurationRepository = manager?.getRepository(configuration_entity_1.Configuration) || this.repository;
        return configurationRepository.save({ ...configuration, idTenant });
    }
    async update(idTenant, id, configuration, manager) {
        const configurationRepository = manager?.getRepository(configuration_entity_1.Configuration) || this.repository;
        return configurationRepository.save({ ...configuration, idTenant, id });
    }
    async updateTenantConfiguration(idTenant, code, value, manager) {
        const configurationRepository = manager?.getRepository(configuration_entity_1.Configuration) || this.repository;
        await configurationRepository.update({ idTenant, code }, { value });
    }
    async delete(idTenant, id, manager) {
        const configurationRepository = manager?.getRepository(configuration_entity_1.Configuration) || this.repository;
        await configurationRepository.delete({ idTenant, id });
    }
    async findOneByCode(idTenant, code, manager) {
        const configurationRepository = manager?.getRepository(configuration_entity_1.Configuration) || this.repository;
        return configurationRepository.findOne({ where: { idTenant, code } });
    }
    async findAll(idTenant, manager) {
        const configurationRepository = manager?.getRepository(configuration_entity_1.Configuration) || this.repository;
        return configurationRepository.find({ where: { idTenant } });
    }
};
exports.ConfigurationsRepository = ConfigurationsRepository;
exports.ConfigurationsRepository = ConfigurationsRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(configuration_entity_1.Configuration)),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], ConfigurationsRepository);
//# sourceMappingURL=configurations.repository.js.map
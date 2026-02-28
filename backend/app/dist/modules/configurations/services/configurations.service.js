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
exports.ConfigurationsService = void 0;
const configurations_repository_1 = require("../repositories/configurations.repository");
const common_1 = require("@nestjs/common");
let ConfigurationsService = class ConfigurationsService {
    configurationsRepository;
    constructor(configurationsRepository) {
        this.configurationsRepository = configurationsRepository;
    }
    async createTenantDefaults(idTenant, manager) {
        this.configurationsRepository.createTenantDefaults(idTenant, manager);
    }
    async getTenantConfiguration(idTenant, code, manager) {
        return this.configurationsRepository.findOneByCode(idTenant, code, manager);
    }
    async updateTenantConfiguration(idTenant, code, value, manager) {
        this.configurationsRepository.updateTenantConfiguration(idTenant, code, value, manager);
    }
};
exports.ConfigurationsService = ConfigurationsService;
exports.ConfigurationsService = ConfigurationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [configurations_repository_1.ConfigurationsRepository])
], ConfigurationsService);
//# sourceMappingURL=configurations.service.js.map
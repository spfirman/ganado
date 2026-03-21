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
exports.ProviderRepository = void 0;
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const provider_entity_1 = require("../entities/provider.entity");
const common_1 = require("@nestjs/common");
let ProviderRepository = class ProviderRepository {
    constructor(repository) {
        this.repository = repository;
    }
    async createProvider(data) {
        const provider = this.repository.create(data);
        return this.repository.save(provider);
    }
    async findByNit(nit, idTenant) {
        return this.repository.findOne({
            where: {
                nit,
                idTenant,
            },
        });
    }
    async findByNitLike(nitFragment, idTenant) {
        return this.repository.find({
            where: {
                nit: (0, typeorm_1.ILike)(`%${nitFragment}%`),
                idTenant,
            },
            order: {
                nit: 'ASC',
                name: 'ASC',
            },
        });
    }
    async findById(id, idTenant, manager) {
        const repo = manager?.getRepository(provider_entity_1.Provider) ?? this.repository;
        return repo.findOne({
            where: {
                id,
                idTenant,
            },
        });
    }
    async findAll(idTenant) {
        return this.repository.find({ where: { idTenant } });
    }
    async findAllWithRelations(idTenant) {
        return this.repository.find({
            where: { idTenant },
            relations: ['contactPerson'],
        });
    }
    async updateById(id, idTenant, data) {
        await this.repository.update({ id, idTenant }, data);
    }
    async updateByNit(nit, idTenant, data) {
        await this.repository.update({ nit, idTenant }, data);
    }
    async deleteById(id, idTenant) {
        await this.repository.delete({ id, idTenant });
    }
    async deleteByNit(nit, idTenant) {
        await this.repository.delete({ nit, idTenant });
    }
};
exports.ProviderRepository = ProviderRepository;
exports.ProviderRepository = ProviderRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(provider_entity_1.Provider)),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], ProviderRepository);
//# sourceMappingURL=provider.repository.js.map
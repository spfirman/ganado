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
var ProviderService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProviderService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const provider_repository_1 = require("../repositories/provider.repository");
const provider_entity_1 = require("../entities/provider.entity");
const contact_entity_1 = require("../entities/contact.entity");
let ProviderService = ProviderService_1 = class ProviderService {
    providerRepository;
    contactRepository;
    dataSource;
    logger = new common_1.Logger(ProviderService_1.name);
    constructor(providerRepository, contactRepository, dataSource) {
        this.providerRepository = providerRepository;
        this.contactRepository = contactRepository;
        this.dataSource = dataSource;
    }
    async createProvider(data) {
        if (!data.name || data.name.trim() === '') {
            throw new common_1.BadRequestException('Provider name is required');
        }
        if (!data.nit || data.nit.trim() === '') {
            throw new common_1.BadRequestException('NIT is required');
        }
        if (!data.type) {
            throw new common_1.BadRequestException('Provider type is required');
        }
        const existing = await this.providerRepository.findByNit(data.nit, data.idTenant);
        if (existing) {
            return existing;
        }
        return await this.dataSource.manager.transaction(async (transactionalEntityManager) => {
            let contactPersonId;
            if (data.contactPersonName || data.phone1 || data.phone2 || data.email) {
                if (data.email && !this.isValidEmail(data.email)) {
                    throw new common_1.BadRequestException('Invalid email format');
                }
                const contactRepo = transactionalEntityManager.getRepository(contact_entity_1.Contact);
                const contact = contactRepo.create({
                    idTenant: data.idTenant,
                    name: data.contactPersonName || '',
                    phone1: data.phone1,
                    phone2: data.phone2,
                    email: data.email,
                });
                const savedContact = await contactRepo.save(contact);
                contactPersonId = savedContact.id;
            }
            const providerRepo = transactionalEntityManager.getRepository(provider_entity_1.Provider);
            const provider = providerRepo.create({
                name: data.name,
                nit: data.nit,
                idTenant: data.idTenant,
                type: data.type,
                address: data.address,
                contactPersonId,
            });
            return await providerRepo.save(provider);
        });
    }
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    async findByNit(nit, idTenant) {
        const provider = await this.providerRepository.findByNit(nit, idTenant);
        if (!provider) {
            throw new common_1.NotFoundException('Provider not found by NIT');
        }
        return provider;
    }
    async searchProvidersByNit(nitFragment, idTenant) {
        return this.providerRepository.findByNitLike(nitFragment, idTenant);
    }
    async findById(id, idTenant) {
        const provider = await this.providerRepository.findById(id, idTenant);
        if (!provider) {
            throw new common_1.NotFoundException('Provider not found by ID');
        }
        return provider;
    }
    async findAll(idTenant) {
        return this.providerRepository.findAll(idTenant);
    }
    async searchByName(name, idTenant) {
        this.logger.debug(`Searching providers by name: "${name}" for tenant: ${idTenant}`);
        const allProviders = await this.providerRepository.findAllWithRelations(idTenant);
        this.logger.debug(`Found ${allProviders.length} total providers for tenant`);
        if (!name || name.trim() === '') {
            return allProviders;
        }
        const searchTerm = name.toLowerCase();
        const filtered = allProviders.filter(p => p.name.toLowerCase().includes(searchTerm));
        this.logger.debug(`Filtered to ${filtered.length} providers matching "${searchTerm}"`);
        return filtered;
    }
    async updateById(id, idTenant, data) {
        const existing = await this.findById(id, idTenant);
        if (data.nit && data.nit !== existing.nit) {
            const existingByNit = await this.providerRepository.findByNit(data.nit, idTenant);
            if (existingByNit) {
                throw new common_1.ConflictException('NIT already exists for this tenant');
            }
        }
        await this.providerRepository.updateById(existing.id, idTenant, data);
    }
    async updateByNit(nit, idTenant, data) {
        const existing = await this.findByNit(nit, idTenant);
        await this.providerRepository.updateByNit(existing.nit, idTenant, data);
    }
    async deleteById(id, idTenant) {
        const existing = await this.findById(id, idTenant);
        await this.providerRepository.deleteById(existing.id, idTenant);
    }
    async deleteByNit(nit, idTenant) {
        const existing = await this.findByNit(nit, idTenant);
        await this.providerRepository.deleteByNit(existing.nit, idTenant);
    }
};
exports.ProviderService = ProviderService;
exports.ProviderService = ProviderService = ProviderService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(contact_entity_1.Contact)),
    __metadata("design:paramtypes", [provider_repository_1.ProviderRepository,
        typeorm_2.Repository,
        typeorm_2.DataSource])
], ProviderService);
//# sourceMappingURL=provider.service.js.map
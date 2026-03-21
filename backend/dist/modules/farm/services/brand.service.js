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
exports.BrandService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const brand_repository_1 = require("../repositories/brand.repository");
let BrandService = class BrandService {
    constructor(brandRepository, dataSource) {
        this.brandRepository = brandRepository;
        this.dataSource = dataSource;
    }
    async create(idTenant, dto, imageFile) {
        if (!dto.name) {
            throw new common_1.BadRequestException('Faltan datos obligatorios: name o idTenant');
        }
        const existing = await this.brandRepository.findByName(idTenant, dto.name);
        if (existing) {
            throw new common_1.ConflictException('Ya existe una marca con ese nombre');
        }
        const brand = {
            id: dto.id,
            idTenant,
            name: dto.name,
            image: imageFile.buffer,
            imageMimeType: imageFile.mimetype,
        };
        return await this.brandRepository.create(brand);
    }
    async findAll(idTenant) {
        return await this.brandRepository.findAll(idTenant);
    }
    async findByIdOrFail(idTenant, id, manager) {
        const brand = await this.brandRepository.findOne(idTenant, id, manager);
        if (!brand)
            throw new common_1.NotFoundException(`Brand ${id} not found`);
        return brand;
    }
    async update(idTenant, id, dto, imageFile) {
        const updated = await this.brandRepository.update(idTenant, id, dto, imageFile);
        if (!updated) {
            throw new common_1.NotFoundException(`Brand ${id} not found`);
        }
        return updated;
    }
    async remove(idTenant, id) {
        await this.brandRepository.delete(idTenant, id);
    }
    async createWithTransaction(idTenant, dto) {
        return await this.dataSource.transaction(async (manager) => {
            if (!dto.name) {
                throw new common_1.BadRequestException('Faltan datos obligatorios: name o idTenant');
            }
            const existing = await this.brandRepository.findByName(idTenant, dto.name, manager);
            if (existing) {
                throw new common_1.ConflictException('Ya existe una marca con ese nombre');
            }
            const fullDto = {
                ...dto,
                idTenant,
            };
            return await this.brandRepository.createWithManager(fullDto, manager);
        });
    }
    async syncBrands(idTenant, brands, filesMap) {
        const results = [];
        for (const b of brands) {
            try {
                const existing = await this.brandRepository.findByName(idTenant, b.name);
                if (existing) {
                    results.push({ id: b.id, status: 'synced', serverId: existing.id });
                    continue;
                }
                const imageField = `image_${b.id.replace(/-/g, '_')}`;
                const imageFile = filesMap.get(imageField);
                if (!imageFile || imageFile.size === 0) {
                    throw new Error(`Image didn't found for brand '${b.name}'`);
                }
                const brand = await this.brandRepository.create({
                    id: b.id,
                    idTenant,
                    name: b.name,
                    image: imageFile.buffer,
                    imageMimeType: imageFile.mimetype,
                });
                results.push({ id: b.id, status: 'synced', serverId: brand.id });
            }
            catch (error) {
                results.push({ id: b.id, status: 'failed', message: error.message });
            }
        }
        return results;
    }
};
exports.BrandService = BrandService;
exports.BrandService = BrandService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [brand_repository_1.BrandRepository,
        typeorm_1.DataSource])
], BrandService);
//# sourceMappingURL=brand.service.js.map
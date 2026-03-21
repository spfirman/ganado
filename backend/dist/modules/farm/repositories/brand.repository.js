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
exports.BrandRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const brand_entity_1 = require("../entities/brand.entity");
const uuid_1 = require("uuid");
let BrandRepository = class BrandRepository {
    constructor(repo) {
        this.repo = repo;
    }
    async create(dto) {
        if (!('id' in dto) || dto.id == null || dto.id == undefined) {
            dto.id = (0, uuid_1.v4)();
        }
        const entity = this.repo.create(dto);
        return await this.repo.save(entity);
    }
    async createWithManager(dto, manager) {
        if (!('id' in dto) || dto.id == null || dto.id == undefined) {
            dto.id = (0, uuid_1.v4)();
        }
        const entity = manager.create(brand_entity_1.Brand, dto);
        return await manager.save(entity);
    }
    async findAll(idTenant) {
        return await this.repo.find({
            where: { idTenant },
            order: { name: 'ASC' },
        });
    }
    async findOne(idTenant, id, manager) {
        const repo = manager?.getRepository(brand_entity_1.Brand) ?? this.repo;
        return await repo.findOne({
            where: { idTenant, id },
            select: ['id', 'idTenant', 'name', 'createdAt', 'updatedAt', 'image'],
        });
    }
    async findByName(idTenant, name, manager) {
        const repo = manager?.getRepository(brand_entity_1.Brand) ?? this.repo;
        return await repo.findOne({ where: { idTenant, name: (0, typeorm_2.ILike)(name) } });
    }
    async update(idTenant, id, dto, imageFile, manager) {
        const repo = manager?.getRepository(brand_entity_1.Brand) ?? this.repo;
        const existing = await repo.findOne({ where: { idTenant, id } });
        if (!existing)
            return null;
        Object.assign(existing, dto);
        if (imageFile) {
            existing.image = imageFile.buffer;
            existing.imageMimeType = imageFile.mimetype;
        }
        return await repo.save(existing);
    }
    async delete(idTenant, id, manager) {
        const repo = manager?.getRepository(brand_entity_1.Brand) ?? this.repo;
        await repo.delete({ idTenant, id });
    }
};
exports.BrandRepository = BrandRepository;
exports.BrandRepository = BrandRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(brand_entity_1.Brand)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], BrandRepository);
//# sourceMappingURL=brand.repository.js.map
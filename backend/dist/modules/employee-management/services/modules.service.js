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
exports.ModulesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const module_entity_1 = require("../entities/module.entity");
const swagger_1 = require("@nestjs/swagger");
const typeorm_3 = require("typeorm");
let ModulesService = class ModulesService {
    moduleRepository;
    constructor(moduleRepository) {
        this.moduleRepository = moduleRepository;
    }
    async findAll(manager) {
        const moduleRepo = manager ? manager.getRepository(module_entity_1.ModuleEntity) : this.moduleRepository;
        return moduleRepo.find();
    }
    async findByName(name, manager) {
        const moduleRepo = manager ? manager.getRepository(module_entity_1.ModuleEntity) : this.moduleRepository;
        const module = await moduleRepo.findOne({
            where: { name }
        });
        if (!module) {
            throw new common_1.NotFoundException(`Module "${name}" not found`);
        }
        return module;
    }
    async findById(id, manager) {
        const moduleRepo = manager ? manager.getRepository(module_entity_1.ModuleEntity) : this.moduleRepository;
        const module = await moduleRepo.findOne({
            where: { id }
        });
        if (!module) {
            throw new common_1.NotFoundException(`Module with ID "${id}" not found`);
        }
        return module;
    }
};
exports.ModulesService = ModulesService;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todos los módulos' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeorm_3.EntityManager]),
    __metadata("design:returntype", Promise)
], ModulesService.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Buscar un módulo por nombre' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeorm_3.EntityManager]),
    __metadata("design:returntype", Promise)
], ModulesService.prototype, "findByName", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Buscar un módulo por ID' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeorm_3.EntityManager]),
    __metadata("design:returntype", Promise)
], ModulesService.prototype, "findById", null);
exports.ModulesService = ModulesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(module_entity_1.ModuleEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ModulesService);
//# sourceMappingURL=modules.service.js.map
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
exports.DeviceRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const device_entity_1 = require("../entities/device.entity");
let DeviceRepository = class DeviceRepository {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async create(createDeviceDto) {
        const device = this.repository.create(createDeviceDto);
        return await this.repository.save(device);
    }
    async findAll(idTenant) {
        return await this.repository.find({ where: { idTenant } });
    }
    async findOne(id) {
        const device = await this.repository.findOne({ where: { id } });
        if (!device) {
            throw new common_1.NotFoundException(`Device with ID ${id} not found`);
        }
        return device;
    }
    async findByIdAndTenantId(id, idTenant, manager) {
        const repo = manager ? manager.getRepository(device_entity_1.Device) : this.repository;
        const device = await repo.findOne({ where: { id, idTenant } });
        if (!device) {
            throw new common_1.NotFoundException(`Device with ID ${id} not found`);
        }
        return device;
    }
    async findByDevEuiAndTenantId(deveui, idTenant, manager) {
        const repo = manager ? manager.getRepository(device_entity_1.Device) : this.repository;
        const device = await repo.findOne({ where: { deveui, idTenant } });
        if (!device) {
            throw new common_1.NotFoundException(`Device with DevEUI ${deveui} not found`);
        }
        return device;
    }
    async update(id, updateDeviceDto, manager) {
        const repo = manager ? manager.getRepository(device_entity_1.Device) : this.repository;
        await repo.update(id, updateDeviceDto);
        return await repo.findOne({ where: { id } });
    }
    async remove(id) {
        const result = await this.repository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Device with ID ${id} not found`);
        }
    }
};
exports.DeviceRepository = DeviceRepository;
exports.DeviceRepository = DeviceRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(device_entity_1.Device)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], DeviceRepository);
//# sourceMappingURL=device.repository.js.map
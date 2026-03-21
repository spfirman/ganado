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
var DeviceProfilesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceProfilesService = void 0;
const common_1 = require("@nestjs/common");
const device_profile_repository_1 = require("../repositories/device-profile.repository");
const axios_1 = require("@nestjs/axios");
const config_1 = require("@nestjs/config");
const rxjs_1 = require("rxjs");
const devices_service_1 = require("./devices.service");
let DeviceProfilesService = DeviceProfilesService_1 = class DeviceProfilesService {
    constructor(deviceProfileRepository, httpService, configService, devicesService) {
        this.deviceProfileRepository = deviceProfileRepository;
        this.httpService = httpService;
        this.configService = configService;
        this.devicesService = devicesService;
        this.logger = new common_1.Logger(DeviceProfilesService_1.name);
        const chirpstackUrl = this.configService.get('CHIRPSTACK_API_URL');
        const chirpstackToken = this.configService.get('CHIRPSTACK_API_KEY');
        if (!chirpstackUrl || !chirpstackToken) {
            throw new Error('CHIRPSTACK_API_URL and CHIRPSTACK_API_KEY must be defined in environment variables');
        }
        this.chirpstackUrl = chirpstackUrl;
        this.chirpstackToken = chirpstackToken;
    }
    async create(createDeviceProfileDto) {
        const existingProfile = await this.deviceProfileRepository
            .findByNameAndTenantId(createDeviceProfileDto.name, createDeviceProfileDto.idTenant)
            .catch(() => null);
        if (existingProfile) {
            throw new common_1.ConflictException(`Device profile with name ${createDeviceProfileDto.name} already exists`);
        }
        await this.validateChirpstackDeviceProfile(createDeviceProfileDto.idChipstack);
        await this.devicesService.existChirpstackApplicationId(createDeviceProfileDto.csApplicationId);
        const devProfile = await this.deviceProfileRepository.create(createDeviceProfileDto);
        this.logger.debug(`Device profile ${devProfile.name} created successfully`);
        this.logger.debug(devProfile);
        return devProfile;
    }
    async validateChirpstackDeviceProfile(idChipstack) {
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${this.chirpstackUrl}/api/device-profiles/${idChipstack}`, {
                headers: {
                    accept: 'application/json',
                    'Grpc-Metadata-Authorization': `Bearer ${this.chirpstackToken}`,
                },
            }));
            if (!response.data) {
                throw new common_1.BadRequestException(`Device profile with ID ${idChipstack} not found in Chirpstack`);
            }
            return response.data;
        }
        catch (error) {
            if (error.response?.status === 401 || error.response?.status === 404) {
                throw new common_1.BadRequestException(`Device profile with ID ${idChipstack} not found in Chirpstack`);
            }
            this.logger.error(error.message);
            throw new common_1.BadRequestException('Error validating device profile with Chirpstack');
        }
    }
    async findAll(idTenant) {
        return await this.deviceProfileRepository.findAll(idTenant);
    }
    async findOne(id, idTenant) {
        return await this.deviceProfileRepository.findOne(id, idTenant);
    }
    async update(id, idTenant, updateDeviceProfileDto) {
        try {
            await this.deviceProfileRepository.findOne(id, idTenant);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw new common_1.ForbiddenException(`You don't have permission to update this device profile`);
            }
            throw error;
        }
        if (updateDeviceProfileDto.name) {
            const existingProfile = await this.deviceProfileRepository
                .findByNameAndTenantId(updateDeviceProfileDto.name, idTenant)
                .catch(() => null);
            if (existingProfile && existingProfile.id !== id) {
                throw new common_1.ConflictException(`Device profile with name ${updateDeviceProfileDto.name} already exists`);
            }
        }
        if (updateDeviceProfileDto.idChipstack) {
            await this.validateChirpstackDeviceProfile(updateDeviceProfileDto.idChipstack);
        }
        return await this.deviceProfileRepository.update(id, updateDeviceProfileDto);
    }
    async remove(id, idTenant) {
        try {
            await this.deviceProfileRepository.findOne(id, idTenant);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw new common_1.ForbiddenException(`You don't have permission to delete this device profile`);
            }
            throw error;
        }
        await this.deviceProfileRepository.remove(id);
    }
};
exports.DeviceProfilesService = DeviceProfilesService;
exports.DeviceProfilesService = DeviceProfilesService = DeviceProfilesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [device_profile_repository_1.DeviceProfileRepository,
        axios_1.HttpService,
        config_1.ConfigService,
        devices_service_1.DevicesService])
], DeviceProfilesService);
//# sourceMappingURL=device-profiles.service.js.map
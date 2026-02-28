"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var DevicesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DevicesService = void 0;
const common_1 = require("@nestjs/common");
const device_repository_1 = require("../repositories/device.repository");
const axios_1 = require("@nestjs/axios");
const config_1 = require("@nestjs/config");
const rxjs_1 = require("rxjs");
const device_profile_repository_1 = require("../repositories/device-profile.repository");
const ExcelJS = __importStar(require("exceljs"));
const fs_1 = require("fs");
let DevicesService = DevicesService_1 = class DevicesService {
    deviceRepository;
    deviceProfileRepository;
    httpService;
    configService;
    chirpstackUrl;
    chirpstackToken;
    logger = new common_1.Logger(DevicesService_1.name);
    constructor(deviceRepository, deviceProfileRepository, httpService, configService) {
        this.deviceRepository = deviceRepository;
        this.deviceProfileRepository = deviceProfileRepository;
        this.httpService = httpService;
        this.configService = configService;
        const chirpstackUrl = this.configService.get('CHIRPSTACK_API_URL');
        const chirpstackToken = this.configService.get('CHIRPSTACK_API_KEY');
        if (!chirpstackUrl || !chirpstackToken) {
            throw new Error('CHIRPSTACK_API_URL and CHIRPSTACK_API_KEY must be defined in environment variables');
        }
        this.chirpstackUrl = chirpstackUrl;
        this.chirpstackToken = chirpstackToken;
    }
    async create(createDeviceDto) {
        const deviceProfile = await this.deviceProfileRepository.findOne(createDeviceDto.idDeviceProfile, createDeviceDto.idTenant);
        if (!deviceProfile) {
            throw new common_1.BadRequestException(`Device profile with ID ${createDeviceDto.idDeviceProfile} not found`);
        }
        const deviceChirpstack = {
            applicationId: deviceProfile.csApplicationId,
            description: createDeviceDto.description,
            devEui: createDeviceDto.deveui,
            deviceProfileId: deviceProfile.idChipstack,
            isDisabled: false,
            joinEui: deviceProfile.csJoineui,
            name: createDeviceDto.name,
            skipFcntCheck: false,
            tags: {},
            variables: {},
        };
        const deviceKeys = {
            appKey: deviceProfile.csAppKey,
            nwkKey: deviceProfile.csNwkKey
        };
        if (createDeviceDto.csJoineui) {
            deviceChirpstack.joinEui = createDeviceDto.csJoineui;
        }
        else {
            createDeviceDto.csJoineui = deviceProfile.csJoineui;
        }
        if (createDeviceDto.csApplicationId) {
            deviceChirpstack.applicationId = createDeviceDto.csApplicationId;
        }
        else {
            createDeviceDto.csApplicationId = deviceProfile.csApplicationId;
        }
        if (createDeviceDto.csAppKey) {
            deviceKeys.appKey = createDeviceDto.csAppKey;
        }
        else {
            createDeviceDto.csAppKey = deviceProfile.csAppKey;
        }
        if (createDeviceDto.csNwkKey) {
            deviceKeys.nwkKey = createDeviceDto.csNwkKey;
        }
        else {
            createDeviceDto.csNwkKey = deviceProfile.csNwkKey;
        }
        return await this.createDevice(createDeviceDto, deviceProfile, deviceChirpstack, deviceKeys);
    }
    async createDevice(createDeviceDto, deviceProfile, deviceChirpstack, deviceKeys) {
        const existingDevice = await this.deviceRepository.findByDevEuiAndTenantId(createDeviceDto.deveui, createDeviceDto.idTenant).catch(() => null);
        if (existingDevice) {
            throw new common_1.ConflictException(`Device with DevEUI ${createDeviceDto.deveui} already exists`);
        }
        const data = await this.createDeviceInChirpstack(deviceChirpstack, deviceKeys);
        if (!data) {
            throw new common_1.BadRequestException(`Error creating device in Chirpstack`);
        }
        return await this.deviceRepository.create(createDeviceDto);
    }
    async getDeviceFromChirpstack(deveui) {
        try {
            const response = await this.httpService.axiosRef.get(`${this.chirpstackUrl}/api/devices/${deveui}`, {
                headers: {
                    'accept': 'application/json',
                    'Grpc-Metadata-Authorization': `Bearer ${this.chirpstackToken}`,
                },
            });
            this.logger.debug(response.data);
            if (response.status === 200) {
                return true;
            }
            return false;
        }
        catch (error) {
            this.logger.error(error.response?.data);
            if (error.response?.status === 401) {
                return false;
            }
            const errorMsg = error.response?.data ? JSON.stringify(error.response.data) : (error.message || 'Unknown error');
            throw new common_1.BadRequestException(`Error validating device ${deveui} with Chirpstack, error: ${errorMsg}`);
        }
    }
    async createDeviceInChirpstack(chirpstackDevice, deviceKeys) {
        try {
            const deviceExists = await this.getDeviceFromChirpstack(chirpstackDevice.devEui);
            if (!deviceExists) {
                const response = await this.httpService.axiosRef.post(`${this.chirpstackUrl}/api/devices`, { device: chirpstackDevice }, {
                    headers: {
                        'accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Grpc-Metadata-Authorization': `Bearer ${this.chirpstackToken}`,
                    },
                });
                if (response.status === 200) {
                    const response = await this.httpService.axiosRef.post(`${this.chirpstackUrl}/api/devices/${chirpstackDevice.devEui}/keys`, {
                        deviceKeys: deviceKeys
                    }, {
                        headers: {
                            'accept': 'application/json',
                            'Content-Type': 'application/json',
                            'Grpc-Metadata-Authorization': `Bearer ${this.chirpstackToken}`
                        },
                    });
                }
                return true;
            }
            else {
                const response = await this.callUpdateDeviceInChirpstack(chirpstackDevice.devEui, chirpstackDevice, deviceKeys);
                return response;
            }
        }
        catch (error) {
            const errorMsg = error.response?.data ? JSON.stringify(error.response.data) : (error.message || 'Unknown error');
            this.logger.error(`Error creating device ${chirpstackDevice.devEui} in Chirpstack: ${errorMsg}`, error.stack);
            throw new common_1.BadRequestException(`Error creating device ${chirpstackDevice.devEui} with Chirpstack, error: ${errorMsg}`);
        }
    }
    async findOne(deveui, idTenant, manager) {
        return await this.deviceRepository.findByDevEuiAndTenantId(deveui, idTenant, manager);
    }
    async findById(id, idTenant, manager) {
        return await this.deviceRepository.findByIdAndTenantId(id, idTenant, manager);
    }
    async update(deveui, idTenant, updateDeviceDto, manager) {
        const existingDevice = await this.deviceRepository.findByDevEuiAndTenantId(deveui, idTenant, manager).catch(() => null);
        if (!existingDevice) {
            throw new common_1.BadRequestException(`Device with DevEUI ${deveui} not found`);
        }
        return await this.updateWithDevice(existingDevice, updateDeviceDto, manager);
    }
    async updateWithDevice(device, updateDeviceDto, manager) {
        this.logger.debug(`log_device 1: Updating device ${device.deveui} with device tags: ${JSON.stringify(updateDeviceDto)}`);
        try {
            const deviceChirpstack = await this.updateDeviceInChirpstack(device.deveui, updateDeviceDto, device);
            if (!deviceChirpstack) {
                this.logger.debug(`log_device 2: Error updating device in Chirpstack`);
                throw new common_1.BadRequestException(`Error updating device in Chirpstack`);
            }
            this.logger.debug(`log_device 3: Device updated in Chirpstack: ${deviceChirpstack}`);
            const deviceUpdated = await this.deviceRepository.update(device.id, updateDeviceDto, manager);
            if (!deviceUpdated) {
                this.logger.debug(`log_device 4: Error updating device ${device.deveui}`);
                throw new common_1.BadRequestException(`Error updating device ${device.deveui}`);
            }
            this.logger.debug(`log_device 5: Device updated: ${deviceUpdated.id}`);
            return deviceUpdated;
        }
        catch (error) {
            const errorMsg = error.response?.data ? JSON.stringify(error.response.data) : (error.message || 'Unknown error');
            this.logger.error(`log_device 6: Error updating device ${device.deveui} with Chirpstack, message: ${error.message}, error: ${errorMsg}`);
            this.logger.debug(`log_device 7: ------------------------------------------------------------`);
            this.logger.debug(`log_device 7:${JSON.stringify(error)}`);
            this.logger.debug(`log_device 7: +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++`);
            throw new common_1.BadRequestException(`Error updating device ${device.deveui} with Chirpstack, message: ${error.message}, error: ${errorMsg}`);
        }
    }
    async updateDeviceInChirpstack(deveui, updateDeviceDto, device) {
        const deviceChirpstack = {};
        if (updateDeviceDto.csApplicationId) {
            deviceChirpstack.applicationId = updateDeviceDto.csApplicationId;
        }
        else {
            deviceChirpstack.applicationId = device.csApplicationId;
        }
        if (updateDeviceDto.description) {
            deviceChirpstack.description = updateDeviceDto.description;
        }
        if (updateDeviceDto.deveui) {
            deviceChirpstack.devEui = updateDeviceDto.deveui;
        }
        if (updateDeviceDto.idDeviceProfile) {
            deviceChirpstack.deviceProfileId = updateDeviceDto.idDeviceProfile;
        }
        else {
            deviceChirpstack.deviceProfileId = device.idChirpstackProfile;
        }
        if (updateDeviceDto.csJoineui) {
            deviceChirpstack.joinEui = updateDeviceDto.csJoineui;
        }
        if (updateDeviceDto.name) {
            deviceChirpstack.name = updateDeviceDto.name;
        }
        else {
            deviceChirpstack.name = device.name;
        }
        if (updateDeviceDto.tags) {
            deviceChirpstack.tags = updateDeviceDto.tags;
        }
        if (updateDeviceDto.variables) {
            deviceChirpstack.variables = updateDeviceDto.variables;
        }
        const deviceKeys = {};
        if (updateDeviceDto.csAppKey) {
            deviceKeys.appKey = updateDeviceDto.csAppKey;
        }
        if (updateDeviceDto.csNwkKey) {
            deviceKeys.nwkKey = updateDeviceDto.csNwkKey;
        }
        const response = await this.callUpdateDeviceInChirpstack(deveui, deviceChirpstack, deviceKeys);
        return response;
    }
    async callUpdateDeviceInChirpstack(deveui, deviceChirpstack, deviceKeys) {
        try {
            this.logger.debug(`log_device 8: ${JSON.stringify(deviceChirpstack)}`);
            this.logger.debug(`log_device 8: fin ------------------------------------------------------------`);
            const response = await this.httpService.axiosRef.put(`${this.chirpstackUrl}/api/devices/${deveui}`, { device: deviceChirpstack }, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Grpc-Metadata-Authorization': `Bearer ${this.chirpstackToken}`
                },
            });
            if (response.status === 200) {
                this.logger.debug(`log_device 9: OK ------------------------------------------------------------`);
                if (deviceKeys.appKey || deviceKeys.nwkKey) {
                    try {
                        const response = await this.httpService.axiosRef.post(`${this.chirpstackUrl}/api/devices/${deveui}/keys`, { deviceKeys: deviceKeys }, {
                            headers: {
                                'accept': 'application/json',
                                'Content-Type': 'application/json',
                                'Grpc-Metadata-Authorization': `Bearer ${this.chirpstackToken}`
                            },
                        });
                    }
                    catch (error) {
                        this.logger.error('Response Chirpstack data:', error.response?.data);
                        const response = await this.httpService.axiosRef.put(`${this.chirpstackUrl}/api/devices/${deveui}/keys`, {
                            deviceKeys: deviceKeys
                        }, {
                            headers: {
                                'accept': 'application/json',
                                'Content-Type': 'application/json',
                                'Grpc-Metadata-Authorization': `Bearer ${this.chirpstackToken}`
                            },
                        });
                    }
                    if (response.status === 200) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
                return true;
            }
            return false;
        }
        catch (error) {
            const errorMsg = error.response?.data ? JSON.stringify(error.response.data) : (error.message || 'Unknown error');
            throw new common_1.BadRequestException(`Error updating device ${deveui} with Chirpstack, message: ${error.message}, error: ${errorMsg}`);
        }
    }
    async remove(id, idTenant) {
        const device = await this.deviceRepository.findByDevEuiAndTenantId(id, idTenant);
        if (!device) {
            throw new common_1.BadRequestException(`Device with ID ${id} not found`);
        }
        const response = await this.httpService.axiosRef.delete(`${this.chirpstackUrl}/api/devices/${device.deveui}`, {
            headers: {
                'accept': 'application/json',
                'Grpc-Metadata-Authorization': `Bearer ${this.chirpstackToken}`
            },
        });
        if (response.status === 200) {
            await this.deviceRepository.remove(id);
        }
        throw new common_1.BadRequestException(`Error removing device ${device.deveui} from Chirpstack`);
    }
    async existChirpstackApplicationId(idApplication) {
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${this.chirpstackUrl}/api/applications/${idApplication}`, {
                headers: {
                    'accept': 'application/json',
                    'Grpc-Metadata-Authorization': `Bearer ${this.chirpstackToken}`,
                },
            }));
            return response.data;
        }
        catch (error) {
            if (error.response?.status === 401 || error.response?.status === 404) {
                throw new common_1.BadRequestException(`Application with ID ${idApplication} not found in Chirpstack, message: ${error.message}, error: ${error.response?.data}`);
            }
            throw new common_1.BadRequestException(`Error validating application with Chirpstack, message: ${error.message}, error: ${error.response?.data}`);
        }
    }
    async findAll(idTenant) {
        return await this.deviceRepository.findAll(idTenant);
    }
    async importDevicesFromExcel(file, idTenant, deviceProfileId) {
        try {
            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.readFile(file.path);
            const worksheet = workbook.worksheets[0];
            if (!worksheet) {
                throw new common_1.BadRequestException('The Excel sheet does not exist or is empty');
            }
            let deviceProfile = null;
            if (deviceProfileId) {
                deviceProfile = await this.deviceProfileRepository.findOne(deviceProfileId, idTenant);
                if (!deviceProfile) {
                    throw new common_1.BadRequestException(`Device profile with ID ${deviceProfileId} not found`);
                }
            }
            const datos = await this.processSheet(worksheet, idTenant, deviceProfile);
            return datos;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error processing the Excel file');
        }
        finally {
            fs_1.promises.unlink(file.path)
                .then(() => this.logger.debug(`File ${file.originalname} deleted from ${file.path}`))
                .catch(err => this.logger.error(`Error deleting file ${file.path}: ${err.message}`));
        }
    }
    async processSheet(worksheet, idTenant, deviceProfile) {
        const results = {
            success: 0,
            failed: 0,
            errors: [],
        };
        for (let rowNumber = 2; rowNumber <= worksheet.rowCount; rowNumber++) {
            try {
                const row = worksheet.getRow(rowNumber);
                const rowValues = Array.isArray(row.values)
                    ? row.values.slice(1).map((v) => typeof v === 'object' && v?.result !== undefined ? v.result : v)
                    : [];
                if (rowValues.length === 0) {
                    results.errors.push(`Row ${rowNumber} is empty`);
                    results.failed++;
                    continue;
                }
                const deveui = rowValues[0];
                if (!deviceProfile && rowValues.length < 3) {
                    results.errors.push(`Row ${rowNumber}, ${deveui}, has not the required columns: devEui, deviceName, deviceProfileId.`);
                    results.failed++;
                    continue;
                }
                if (rowValues.length < 2) {
                    results.errors.push(`Row ${rowNumber}, ${deveui}, has not the required columns: devEui, deviceName.`);
                    results.failed++;
                    continue;
                }
                let currentDeviceProfile = deviceProfile;
                if (!currentDeviceProfile) {
                    try {
                        currentDeviceProfile = await this.deviceProfileRepository.findOne(rowValues[2], idTenant);
                        if (!currentDeviceProfile) {
                            throw new Error(`Device profile with ID ${rowValues[2]} not found`);
                        }
                    }
                    catch (error) {
                        results.errors.push(`Row ${rowNumber}, ${deveui}, ${error.message}`);
                        results.failed++;
                        continue;
                    }
                }
                try {
                    const device = await this.processExcelRow(rowValues, rowNumber, idTenant, currentDeviceProfile);
                    results.success++;
                }
                catch (error) {
                    results.errors.push(`Row ${rowNumber}, ${deveui}, ${error.message}`);
                    results.failed++;
                }
            }
            catch (error) {
                results.errors.push(`Row ${rowNumber}, ${error.message}`);
                results.failed++;
            }
        }
        return results;
    }
    async processExcelRow(rowValues, rowNumber, idTenant, deviceProfile) {
        const createDeviceDto = {
            idTenant: idTenant,
            idDeviceProfile: deviceProfile.id,
            deveui: rowValues[0],
            name: rowValues[1],
            description: "",
            csApplicationId: deviceProfile.csApplicationId,
            csJoineui: deviceProfile.csJoineui,
            csAppKey: deviceProfile.csAppKey,
            csNwkKey: deviceProfile.csNwkKey,
            tags: {},
            variables: {},
        };
        const deviceChirpstack = {
            applicationId: deviceProfile.csApplicationId,
            description: createDeviceDto.description,
            devEui: createDeviceDto.deveui,
            deviceProfileId: deviceProfile.idChipstack,
            isDisabled: false,
            joinEui: deviceProfile.csJoineui,
            name: createDeviceDto.name,
            skipFcntCheck: false,
            tags: {},
            variables: {},
        };
        const deviceKeys = {
            appKey: deviceProfile.csAppKey,
            nwkKey: deviceProfile.csNwkKey
        };
        if (rowValues.length >= 4) {
            createDeviceDto.description = rowValues[3];
            deviceChirpstack.description = rowValues[3];
        }
        if (rowValues.length >= 5) {
            createDeviceDto.csJoineui = rowValues[4];
            deviceChirpstack.joinEui = rowValues[4];
        }
        if (rowValues.length >= 6) {
            createDeviceDto.csNwkKey = rowValues[5];
            deviceKeys.nwkKey = rowValues[5];
        }
        if (rowValues.length >= 7) {
            createDeviceDto.tags = rowValues[6];
            deviceChirpstack.tags = rowValues[6];
        }
        if (rowValues.length >= 8) {
            createDeviceDto.variables = rowValues[7];
            deviceChirpstack.variables = rowValues[7];
        }
        try {
            const device = await this.createDevice(createDeviceDto, deviceProfile, deviceChirpstack, deviceKeys);
            return device;
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
};
exports.DevicesService = DevicesService;
exports.DevicesService = DevicesService = DevicesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [device_repository_1.DeviceRepository,
        device_profile_repository_1.DeviceProfileRepository,
        axios_1.HttpService,
        config_1.ConfigService])
], DevicesService);
//# sourceMappingURL=devices.service.js.map
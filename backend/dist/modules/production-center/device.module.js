"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const axios_1 = require("@nestjs/axios");
const config_1 = require("@nestjs/config");
const device_entity_1 = require("./entities/device.entity");
const device_profile_entity_1 = require("./entities/device-profile.entity");
const devices_controller_1 = require("./controllers/devices.controller");
const device_profiles_controller_1 = require("./controllers/device-profiles.controller");
const devices_service_1 = require("./services/devices.service");
const device_profiles_service_1 = require("./services/device-profiles.service");
const device_repository_1 = require("./repositories/device.repository");
const device_profile_repository_1 = require("./repositories/device-profile.repository");
let DeviceModule = class DeviceModule {
};
exports.DeviceModule = DeviceModule;
exports.DeviceModule = DeviceModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([device_entity_1.Device, device_profile_entity_1.DeviceProfile]),
            axios_1.HttpModule,
            config_1.ConfigModule,
        ],
        controllers: [devices_controller_1.DevicesController, device_profiles_controller_1.DeviceProfilesController],
        providers: [devices_service_1.DevicesService, device_profiles_service_1.DeviceProfilesService, device_repository_1.DeviceRepository, device_profile_repository_1.DeviceProfileRepository],
        exports: [devices_service_1.DevicesService, device_profiles_service_1.DeviceProfilesService],
    })
], DeviceModule);
//# sourceMappingURL=device.module.js.map
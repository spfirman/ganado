"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FarmModule = void 0;
const common_1 = require("@nestjs/common");
const commerce_module_1 = require("../commerce/commerce.module");
const typeorm_1 = require("@nestjs/typeorm");
const cattle_entity_1 = require("./entities/cattle.entity");
const cattle_repository_1 = require("./repositories/cattle.repository");
const cattle_service_1 = require("./services/cattle.service");
const cattle_controller_1 = require("./controllers/cattle.controller");
const config_1 = require("@nestjs/config");
const application_permissions_module_1 = require("../../common/application-permissions/application-permissions.module");
const cattle_device_history_entity_1 = require("./entities/cattle-device-history.entity");
const cattle_device_history_repository_1 = require("./repositories/cattle-device-history.repository");
const cattle_weight_history_entity_1 = require("./entities/cattle-weight-history.entity");
const cattle_weight_history_repository_1 = require("./repositories/cattle-weight-history.repository");
const cattle_eartag_history_entity_1 = require("./entities/cattle-eartag-history.entity");
const cattle_eartag_history_repository_1 = require("./repositories/cattle-eartag-history.repository");
const cattle_medication_history_entity_1 = require("./entities/cattle-medication-history.entity");
const cattle_medication_history_repository_1 = require("./repositories/cattle-medication-history.repository");
const production_center_module_1 = require("../production-center/production-center.module");
const location_entity_1 = require("./entities/location.entity");
const location_service_1 = require("./services/location.service");
const location_repository_1 = require("./repositories/location.repository");
const location_controller_1 = require("./controllers/location.controller");
const massive_events_module_1 = require("../massive-events/massive-events.module");
const brand_controller_1 = require("./controllers/brand.controller");
const brand_repository_1 = require("./repositories/brand.repository");
const brand_service_1 = require("./services/brand.service");
const brand_entity_1 = require("./entities/brand.entity");
const cattle_characteristic_repository_1 = require("./repositories/cattle-characteristic.repository");
const cattle_characteristic_entity_1 = require("./entities/cattle-characteristic.entity");
const color_characteristics_service_1 = require("./services/color-characteristics.service");
const color_characteristics_controller_1 = require("./controllers/color-characteristics.controller");
const configuration_module_1 = require("../configurations/configuration.module");
let FarmModule = class FarmModule {
};
exports.FarmModule = FarmModule;
exports.FarmModule = FarmModule = __decorate([
    (0, common_1.Module)({
        imports: [
            (0, common_1.forwardRef)(() => massive_events_module_1.MassiveEventsModule),
            (0, common_1.forwardRef)(() => commerce_module_1.CommerceModule),
            configuration_module_1.ConfigurationModule,
            typeorm_1.TypeOrmModule.forFeature([
                cattle_entity_1.Cattle,
                cattle_characteristic_entity_1.CattleCharacteristic,
                cattle_device_history_entity_1.CattleDeviceHistory,
                cattle_weight_history_entity_1.CattleWeightHistory,
                cattle_eartag_history_entity_1.CattleEartagHistory,
                cattle_medication_history_entity_1.CattleMedicationHistory,
                location_entity_1.Location,
                brand_entity_1.Brand
            ]),
            config_1.ConfigModule,
            application_permissions_module_1.ApplicationPermissionsModule,
            production_center_module_1.ProductionCenterModule
        ],
        providers: [
            cattle_repository_1.CattleRepository,
            cattle_service_1.CattleService,
            cattle_device_history_repository_1.CattleDeviceHistoryRepository,
            cattle_weight_history_repository_1.CattleWeightHistoryRepository,
            cattle_eartag_history_repository_1.CattleEartagHistoryRepository,
            cattle_medication_history_repository_1.CattleMedicationHistoryRepository,
            cattle_characteristic_repository_1.CattleCharacteristicRepository,
            location_service_1.LocationService,
            location_repository_1.LocationRepository,
            brand_repository_1.BrandRepository,
            brand_service_1.BrandService,
            color_characteristics_service_1.ColorCharacteristicsService,
        ],
        controllers: [
            brand_controller_1.BrandController,
            color_characteristics_controller_1.ColorCharacteristicsController,
            cattle_controller_1.CattleController,
            location_controller_1.LocationController,
        ],
        exports: [
            color_characteristics_service_1.ColorCharacteristicsService,
            cattle_service_1.CattleService,
            location_service_1.LocationService,
            cattle_repository_1.CattleRepository,
            cattle_device_history_repository_1.CattleDeviceHistoryRepository,
            cattle_weight_history_repository_1.CattleWeightHistoryRepository,
            cattle_characteristic_repository_1.CattleCharacteristicRepository
        ],
    })
], FarmModule);
//# sourceMappingURL=farm.module.js.map
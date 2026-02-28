"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReceptionModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const application_permissions_module_1 = require("../../common/application-permissions/application-permissions.module");
const commerce_module_1 = require("../commerce/commerce.module");
const massive_events_module_1 = require("../massive-events/massive-events.module");
const farm_module_1 = require("../farm/farm.module");
const configuration_module_1 = require("../configurations/configuration.module");
const purchase_reception_entity_1 = require("./entities/purchase-reception.entity");
const device_entity_1 = require("../production-center/entities/device.entity");
const purchase_reception_repository_1 = require("./repositories/purchase-reception.repository");
const receptions_service_1 = require("./services/receptions.service");
const purchase_reception_controller_1 = require("./controllers/purchase-reception.controller");
const production_center_module_1 = require("../production-center/production-center.module");
let ReceptionModule = class ReceptionModule {
};
exports.ReceptionModule = ReceptionModule;
exports.ReceptionModule = ReceptionModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([purchase_reception_entity_1.PurchaseReception, device_entity_1.Device]),
            application_permissions_module_1.ApplicationPermissionsModule,
            commerce_module_1.CommerceModule,
            massive_events_module_1.MassiveEventsModule,
            farm_module_1.FarmModule,
            configuration_module_1.ConfigurationModule,
            production_center_module_1.ProductionCenterModule
        ],
        controllers: [purchase_reception_controller_1.ReceptionController],
        providers: [receptions_service_1.ReceptionsService, purchase_reception_repository_1.PurchaseReceptionRepository],
        exports: [receptions_service_1.ReceptionsService, purchase_reception_repository_1.PurchaseReceptionRepository],
    })
], ReceptionModule);
//# sourceMappingURL=reception.module.js.map
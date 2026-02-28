"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const employee_management_module_1 = require("./modules/employee-management/employee-management.module");
const auth_module_1 = require("./modules/auth/auth.module");
const typeorm_config_1 = require("./config/typeorm.config");
const production_center_module_1 = require("./modules/production-center/production-center.module");
const farm_module_1 = require("./modules/farm/farm.module");
const mqtt_module_1 = require("./modules/mqtt/mqtt.module");
const commerce_module_1 = require("./modules/commerce/commerce.module");
const reception_module_1 = require("./modules/purchase-receptions/reception.module");
const configuration_module_1 = require("./modules/configurations/configuration.module");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: ['.env'],
            }),
            typeorm_1.TypeOrmModule.forRoot(typeorm_config_1.typeOrmConfig),
            auth_module_1.AuthModule,
            employee_management_module_1.EmployeeManagementModule,
            production_center_module_1.ProductionCenterModule,
            farm_module_1.FarmModule,
            commerce_module_1.CommerceModule,
            reception_module_1.ReceptionModule,
            configuration_module_1.ConfigurationModule,
            mqtt_module_1.MqttModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map
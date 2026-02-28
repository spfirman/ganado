"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommerceModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const application_permissions_module_1 = require("../../common/application-permissions/application-permissions.module");
const farm_module_1 = require("../farm/farm.module");
const production_center_module_1 = require("../production-center/production-center.module");
const contact_entity_1 = require("./entities/contact.entity");
const provider_entity_1 = require("./entities/provider.entity");
const provider_controller_1 = require("./controllers/provider.controller");
const provider_service_1 = require("./services/provider.service");
const provider_repository_1 = require("./repositories/provider.repository");
const purchase_entity_1 = require("./entities/purchase.entity");
const purchase_controller_1 = require("./controllers/purchase.controller");
const purchase_service_1 = require("./services/purchase.service");
const purchase_repository_1 = require("./repositories/purchase.repository");
const lot_entity_1 = require("./entities/lot.entity");
const lot_repository_1 = require("./repositories/lot.repository");
const lot_controller_1 = require("./controllers/lot.controller");
const lot_service_1 = require("./services/lot.service");
const sale_entity_1 = require("./entities/sale.entity");
const sale_detail_entity_1 = require("./entities/sale-detail.entity");
const sales_controller_1 = require("./controllers/sales.controller");
const sales_service_1 = require("./services/sales.service");
let CommerceModule = class CommerceModule {
};
exports.CommerceModule = CommerceModule;
exports.CommerceModule = CommerceModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                contact_entity_1.Contact,
                provider_entity_1.Provider,
                purchase_entity_1.Purchase,
                lot_entity_1.Lot,
                sale_entity_1.Sale,
                sale_detail_entity_1.SaleDetail,
            ]),
            config_1.ConfigModule,
            application_permissions_module_1.ApplicationPermissionsModule,
            (0, common_1.forwardRef)(() => farm_module_1.FarmModule),
            production_center_module_1.ProductionCenterModule,
        ],
        controllers: [lot_controller_1.LotController, provider_controller_1.ProviderController, purchase_controller_1.PurchaseController, sales_controller_1.SalesController],
        providers: [
            provider_service_1.ProviderService,
            provider_repository_1.ProviderRepository,
            purchase_service_1.PurchaseService,
            purchase_repository_1.PurchaseRepository,
            lot_repository_1.LotRepository,
            lot_service_1.LotService,
            sales_service_1.SalesService,
        ],
        exports: [provider_repository_1.ProviderRepository, purchase_repository_1.PurchaseRepository, lot_repository_1.LotRepository, lot_service_1.LotService, purchase_service_1.PurchaseService],
    })
], CommerceModule);
//# sourceMappingURL=commerce.module.js.map
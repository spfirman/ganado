"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MassiveEventsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const massive_events_entity_1 = require("./entities/massive-events.entity");
const simple_event_entity_1 = require("./entities/simple-event.entity");
const animal_simple_event_entity_1 = require("./entities/animal-simple-event.entity");
const massive_event_repository_1 = require("./repositories/massive-event.repository");
const simple_event_repository_1 = require("./repositories/simple-event.repository");
const animal_simple_event_repository_1 = require("./repositories/animal-simple-event.repository");
const massive_event_service_1 = require("./services/massive-event.service");
const simple_event_service_1 = require("./services/simple-event.service");
const massive_event_controller_1 = require("./controllers/massive-event.controller");
const simple_event_controller_1 = require("./controllers/simple-event.controller");
const farm_module_1 = require("../farm/farm.module");
const application_permissions_module_1 = require("../../common/application-permissions/application-permissions.module");
let MassiveEventsModule = class MassiveEventsModule {
};
exports.MassiveEventsModule = MassiveEventsModule;
exports.MassiveEventsModule = MassiveEventsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            (0, common_1.forwardRef)(() => farm_module_1.FarmModule),
            application_permissions_module_1.ApplicationPermissionsModule,
            typeorm_1.TypeOrmModule.forFeature([massive_events_entity_1.MassiveEvent, simple_event_entity_1.SimpleEvent, animal_simple_event_entity_1.AnimalSimpleEvent]),
        ],
        controllers: [massive_event_controller_1.MassiveEventController, simple_event_controller_1.SimpleEventController],
        providers: [
            massive_event_repository_1.MassiveEventRepository,
            simple_event_repository_1.SimpleEventRepository,
            animal_simple_event_repository_1.AnimalSimpleEventRepository,
            massive_event_service_1.MassiveEventService,
            simple_event_service_1.SimpleEventService,
        ],
        exports: [
            massive_event_repository_1.MassiveEventRepository,
            simple_event_repository_1.SimpleEventRepository,
            animal_simple_event_repository_1.AnimalSimpleEventRepository,
            massive_event_service_1.MassiveEventService,
            simple_event_service_1.SimpleEventService,
        ],
    })
], MassiveEventsModule);
//# sourceMappingURL=massive-events.module.js.map
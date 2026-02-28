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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColorCharacteristicsService = void 0;
const common_1 = require("@nestjs/common");
const cattle_color_enum_1 = require("../enums/cattle-color.enum");
const cattle_characteristic_enum_1 = require("../enums/cattle-characteristic.enum");
let ColorCharacteristicsService = class ColorCharacteristicsService {
    constructor() { }
    getAllColors() {
        return Object.values(cattle_color_enum_1.CattleColor);
    }
    getAllCharacteristics() {
        return Object.values(cattle_characteristic_enum_1.CattleCharacteristicEnum);
    }
};
exports.ColorCharacteristicsService = ColorCharacteristicsService;
exports.ColorCharacteristicsService = ColorCharacteristicsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], ColorCharacteristicsService);
//# sourceMappingURL=color-characteristics.service.js.map
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
exports.Location = void 0;
const typeorm_1 = require("typeorm");
let Location = class Location {
    id;
    idTenant;
    idDevice;
    idCattle;
    latitude;
    longitude;
    altitude;
    time;
    createdAt;
};
exports.Location = Location;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Location.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_tenant' }),
    __metadata("design:type", String)
], Location.prototype, "idTenant", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_device' }),
    __metadata("design:type", String)
], Location.prototype, "idDevice", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_cattle' }),
    __metadata("design:type", String)
], Location.prototype, "idCattle", void 0);
__decorate([
    (0, typeorm_1.Column)('numeric', { precision: 10, scale: 6 }),
    __metadata("design:type", Number)
], Location.prototype, "latitude", void 0);
__decorate([
    (0, typeorm_1.Column)('numeric', { precision: 10, scale: 6 }),
    __metadata("design:type", Number)
], Location.prototype, "longitude", void 0);
__decorate([
    (0, typeorm_1.Column)('numeric', { precision: 10, scale: 6, nullable: true }),
    __metadata("design:type", Number)
], Location.prototype, "altitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'time' }),
    __metadata("design:type", Date)
], Location.prototype, "time", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Location.prototype, "createdAt", void 0);
exports.Location = Location = __decorate([
    (0, typeorm_1.Entity)('location')
], Location);
//# sourceMappingURL=location.entity.js.map
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
exports.LocationRepository = void 0;
const typeorm_1 = require("typeorm");
const location_entity_1 = require("../entities/location.entity");
const common_1 = require("@nestjs/common");
let LocationRepository = class LocationRepository extends typeorm_1.Repository {
    constructor(dataSource) {
        super(location_entity_1.Location, dataSource.createEntityManager());
        this.dataSource = dataSource;
    }
    async findLatestByDevice(deviceId, idTenant) {
        return this.createQueryBuilder('location')
            .where('location.id_device = :deviceId', { deviceId })
            .andWhere('location.id_tenant = :idTenant', { idTenant })
            .orderBy('location.created_at', 'DESC')
            .getOne();
    }
    async findLatestByCattle(cattleId, idTenant) {
        return this.createQueryBuilder('location')
            .where('location.id_cattle = :cattleId', { cattleId })
            .andWhere('location.id_tenant = :idTenant', { idTenant })
            .orderBy('location.created_at', 'DESC')
            .getOne();
    }
    async createLocation(locationDto) {
        const location = this.create(locationDto);
        return this.save(location);
    }
};
exports.LocationRepository = LocationRepository;
exports.LocationRepository = LocationRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], LocationRepository);
//# sourceMappingURL=location.repository.js.map
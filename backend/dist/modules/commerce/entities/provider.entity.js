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
exports.Provider = exports.ProviderType = void 0;
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const contact_entity_1 = require("./contact.entity");
var ProviderType;
(function (ProviderType) {
    ProviderType["BUYER"] = "BUYER";
    ProviderType["TRANSPORTER"] = "TRANSPORTER";
    ProviderType["VET"] = "VET";
    ProviderType["OTHER"] = "OTHER";
    ProviderType["PROVIDER"] = "PROVIDER";
})(ProviderType || (exports.ProviderType = ProviderType = {}));
let Provider = class Provider {
};
exports.Provider = Provider;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Provider.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_tenant', type: 'uuid' }),
    __metadata("design:type", String)
], Provider.prototype, "idTenant", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 150 }),
    __metadata("design:type", String)
], Provider.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 20, nullable: false }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], Provider.prototype, "nit", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ProviderType,
        default: ProviderType.OTHER,
    }),
    __metadata("design:type", String)
], Provider.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255, nullable: true }),
    __metadata("design:type", String)
], Provider.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'contact_person_id', type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Provider.prototype, "contactPersonId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => contact_entity_1.Contact, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'contact_person_id' }),
    __metadata("design:type", contact_entity_1.Contact)
], Provider.prototype, "contactPerson", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Provider.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Provider.prototype, "updated_at", void 0);
exports.Provider = Provider = __decorate([
    (0, typeorm_1.Unique)(['nit', 'idTenant']),
    (0, typeorm_1.Entity)('providers')
], Provider);
//# sourceMappingURL=provider.entity.js.map
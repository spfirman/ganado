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
exports.CreateTenantDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateTenantDto {
}
exports.CreateTenantDto = CreateTenantDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nombre del tenant',
        example: 'Finca Los Alamos',
        required: true,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Length)(1, 150),
    __metadata("design:type", String)
], CreateTenantDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nombre de usuario de la compania',
        example: 'finca_alamos',
        required: true,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Length)(1, 50),
    __metadata("design:type", String)
], CreateTenantDto.prototype, "company_username", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Estado del tenant',
        example: true,
        required: true,
        default: true,
    }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateTenantDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nombre de usuario del administrador',
        example: 'admin.finca_alamos',
        required: true,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Length)(1, 50),
    __metadata("design:type", String)
], CreateTenantDto.prototype, "admin_username", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nombre del administrador',
        example: 'Juan',
        required: true,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Length)(1, 50),
    __metadata("design:type", String)
], CreateTenantDto.prototype, "admin_first_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Apellido del administrador',
        example: 'Perez',
        required: true,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Length)(1, 50),
    __metadata("design:type", String)
], CreateTenantDto.prototype, "admin_last_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Contrasena del administrador',
        example: 'Contrasena123!',
        required: true,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Length)(8, 50),
    __metadata("design:type", String)
], CreateTenantDto.prototype, "admin_password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Correo electronico del administrador',
        example: 'admin@fincaalamos.com',
        required: true,
    }),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Length)(1, 150),
    __metadata("design:type", String)
], CreateTenantDto.prototype, "admin_email", void 0);
//# sourceMappingURL=create-tenant.dto.js.map
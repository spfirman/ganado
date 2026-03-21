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
exports.UpdateRoleResponseDto = exports.UpdateRoleDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class UpdateRoleDto {
}
exports.UpdateRoleDto = UpdateRoleDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nombre del rol',
        example: 'Administrador',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateRoleDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Descripcion del rol',
        example: 'Rol con acceso total al sistema',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateRoleDto.prototype, "description", void 0);
class UpdateRoleResponseDto {
}
exports.UpdateRoleResponseDto = UpdateRoleResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID del rol actualizado',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    __metadata("design:type", String)
], UpdateRoleResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nombre del rol',
        example: 'Administrador',
    }),
    __metadata("design:type", String)
], UpdateRoleResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Descripcion del rol',
        example: 'Rol con acceso total al sistema',
    }),
    __metadata("design:type", String)
], UpdateRoleResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Permisos del rol',
        example: [
            {
                id: '123e4567-e89b-12d3-a456-426614174001',
                can_create: true,
                can_read: true,
                can_update: true,
                can_delete: true,
                module: {
                    id: '123e4567-e89b-12d3-a456-426614174002',
                    name: 'Employee Management',
                    description: 'Gestion de empleados y roles',
                },
            },
        ],
    }),
    __metadata("design:type", Array)
], UpdateRoleResponseDto.prototype, "permissions", void 0);
//# sourceMappingURL=update-role.dto.js.map
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
exports.UpdatePermissionResponseDto = exports.UpdatePermissionDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class UpdatePermissionDto {
    can_create;
    can_read;
    can_update;
    can_delete;
    can_list;
}
exports.UpdatePermissionDto = UpdatePermissionDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Permiso para crear',
        example: true,
        required: false,
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdatePermissionDto.prototype, "can_create", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Permiso para leer',
        example: true,
        required: false,
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdatePermissionDto.prototype, "can_read", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Permiso para actualizar',
        example: false,
        required: false,
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdatePermissionDto.prototype, "can_update", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Permiso para eliminar',
        example: true,
        required: false,
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdatePermissionDto.prototype, "can_delete", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Permiso para  Listar',
        example: true,
        required: false,
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdatePermissionDto.prototype, "can_list", void 0);
class UpdatePermissionResponseDto {
    id;
    id_role;
    id_module;
    tenant_id;
    can_create;
    can_read;
    can_update;
    can_delete;
    can_list;
    module;
}
exports.UpdatePermissionResponseDto = UpdatePermissionResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID del permiso actualizado',
        example: '123e4567-e89b-12d3-a456-426614174001',
    }),
    __metadata("design:type", String)
], UpdatePermissionResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID del rol al que pertenece el permiso',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    __metadata("design:type", String)
], UpdatePermissionResponseDto.prototype, "id_role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID del módulo al que pertenece el permiso',
        example: '123e4567-e89b-12d3-a456-426614174002',
    }),
    __metadata("design:type", String)
], UpdatePermissionResponseDto.prototype, "id_module", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID del tenant al que pertenece el permiso',
        example: '123e4567-e89b-12d3-a456-426614174003',
    }),
    __metadata("design:type", String)
], UpdatePermissionResponseDto.prototype, "tenant_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Permiso para crear',
        example: true,
    }),
    __metadata("design:type", Boolean)
], UpdatePermissionResponseDto.prototype, "can_create", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Permiso para leer',
        example: true,
    }),
    __metadata("design:type", Boolean)
], UpdatePermissionResponseDto.prototype, "can_read", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Permiso para actualizar',
        example: false,
    }),
    __metadata("design:type", Boolean)
], UpdatePermissionResponseDto.prototype, "can_update", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Permiso para eliminar',
        example: true,
    }),
    __metadata("design:type", Boolean)
], UpdatePermissionResponseDto.prototype, "can_delete", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Permiso para listar',
        example: true,
    }),
    __metadata("design:type", Boolean)
], UpdatePermissionResponseDto.prototype, "can_list", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Información del módulo',
        example: {
            id: '123e4567-e89b-12d3-a456-426614174002',
            name: 'Employee Management',
            description: 'Gestión de empleados y roles'
        }
    }),
    __metadata("design:type", Object)
], UpdatePermissionResponseDto.prototype, "module", void 0);
//# sourceMappingURL=update-permission.dto.js.map
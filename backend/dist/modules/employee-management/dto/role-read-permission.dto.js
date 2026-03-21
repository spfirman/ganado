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
exports.RoleReadPermissionDto = exports.ModuleReadDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class ModuleReadDto {
}
exports.ModuleReadDto = ModuleReadDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID del modulo',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    __metadata("design:type", String)
], ModuleReadDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Codigo del modulo',
        example: 'EMP_MGMT',
    }),
    __metadata("design:type", String)
], ModuleReadDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nombre del modulo',
        example: 'Gestion de Empleados',
    }),
    __metadata("design:type", String)
], ModuleReadDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Detalles de acceso adicionales del modulo',
        example: {
            customField: 'valor',
            settings: { enabled: true },
        },
    }),
    __metadata("design:type", Object)
], ModuleReadDto.prototype, "access_details", void 0);
class RoleReadPermissionDto {
    static transformToDto(permission) {
        const roleReadPermissionDto = new RoleReadPermissionDto();
        roleReadPermissionDto.id = permission.id;
        roleReadPermissionDto.can_create = permission.can_create;
        roleReadPermissionDto.can_read = permission.can_read;
        roleReadPermissionDto.can_update = permission.can_update;
        roleReadPermissionDto.can_delete = permission.can_delete;
        roleReadPermissionDto.can_list = permission.can_list;
        roleReadPermissionDto.module = permission.module;
        return roleReadPermissionDto;
    }
}
exports.RoleReadPermissionDto = RoleReadPermissionDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID del permiso',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    __metadata("design:type", String)
], RoleReadPermissionDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Permiso para crear',
        example: true,
    }),
    __metadata("design:type", Boolean)
], RoleReadPermissionDto.prototype, "can_create", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Permiso para leer',
        example: true,
    }),
    __metadata("design:type", Boolean)
], RoleReadPermissionDto.prototype, "can_read", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Permiso para actualizar',
        example: true,
    }),
    __metadata("design:type", Boolean)
], RoleReadPermissionDto.prototype, "can_update", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Permiso para eliminar',
        example: false,
    }),
    __metadata("design:type", Boolean)
], RoleReadPermissionDto.prototype, "can_delete", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Permiso para listar',
        example: true,
    }),
    __metadata("design:type", Boolean)
], RoleReadPermissionDto.prototype, "can_list", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Informacion del modulo asociado',
        type: ModuleReadDto,
    }),
    __metadata("design:type", ModuleReadDto)
], RoleReadPermissionDto.prototype, "module", void 0);
//# sourceMappingURL=role-read-permission.dto.js.map
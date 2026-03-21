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
exports.RoleReadDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const role_read_permission_dto_1 = require("./role-read-permission.dto");
class RoleReadDto {
    static transformToDto(role) {
        const roleDto = new RoleReadDto();
        roleDto.id = role.id;
        roleDto.code = role.code;
        roleDto.name = role.name;
        roleDto.permissions = role.permissions?.map((permission) => ({
            id: permission.id,
            can_create: permission.can_create,
            can_read: permission.can_read,
            can_update: permission.can_update,
            can_delete: permission.can_delete,
            can_list: permission.can_list,
            module: {
                id: permission.module.id,
                code: permission.module.code,
                name: permission.module.name,
                access_details: permission.module.access_details,
            },
        }));
        return roleDto;
    }
}
exports.RoleReadDto = RoleReadDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID del rol',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    __metadata("design:type", String)
], RoleReadDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Codigo del rol',
        example: 'ADMIN',
    }),
    __metadata("design:type", String)
], RoleReadDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nombre del rol',
        example: 'Administrador',
    }),
    __metadata("design:type", String)
], RoleReadDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Lista de permisos asociados al rol',
        type: [role_read_permission_dto_1.RoleReadPermissionDto],
        example: [
            {
                id: '123e4567-e89b-12d3-a456-426614174001',
                can_create: true,
                can_read: true,
                can_update: true,
                can_delete: false,
                can_list: true,
                module: {
                    id: '123e4567-e89b-12d3-a456-426614174002',
                    code: 'EMP_MGMT',
                    name: 'Gestion de Empleados',
                    access_details: {
                        roles: '0R00L',
                        users: 'CRUDL',
                        permissions: 'CRUDL',
                    },
                },
            },
        ],
    }),
    __metadata("design:type", Array)
], RoleReadDto.prototype, "permissions", void 0);
//# sourceMappingURL=role-read.dto.js.map
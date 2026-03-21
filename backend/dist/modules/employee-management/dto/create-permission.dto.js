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
exports.CreatePermissionResponseDto = exports.CreatePermissionDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreatePermissionDto {
}
exports.CreatePermissionDto = CreatePermissionDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID del modulo al que se le asigna el permiso',
        example: '123e4567-e89b-12d3-a456-426614174002',
        required: true,
    }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreatePermissionDto.prototype, "roleId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID del modulo al que se le asigna el permiso',
        example: '123e4567-e89b-12d3-a456-426614174002',
        required: true,
    }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreatePermissionDto.prototype, "moduleId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Permiso para crear',
        example: true,
        required: true,
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Boolean)
], CreatePermissionDto.prototype, "can_create", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Permiso para leer',
        example: true,
        required: true,
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Boolean)
], CreatePermissionDto.prototype, "can_read", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Permiso para actualizar',
        example: true,
        required: true,
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Boolean)
], CreatePermissionDto.prototype, "can_update", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Permiso para eliminar',
        example: true,
        required: true,
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Boolean)
], CreatePermissionDto.prototype, "can_delete", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Permiso para listar',
        example: true,
        required: true,
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Boolean)
], CreatePermissionDto.prototype, "can_list", void 0);
class CreatePermissionResponseDto {
}
exports.CreatePermissionResponseDto = CreatePermissionResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID del permiso creado',
        example: '123e4567-e89b-12d3-a456-426614174001',
    }),
    __metadata("design:type", String)
], CreatePermissionResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID del rol al que pertenece el permiso',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    __metadata("design:type", String)
], CreatePermissionResponseDto.prototype, "id_role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID del modulo al que pertenece el permiso',
        example: '123e4567-e89b-12d3-a456-426614174002',
    }),
    __metadata("design:type", String)
], CreatePermissionResponseDto.prototype, "id_module", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID del tenant al que pertenece el permiso',
        example: '123e4567-e89b-12d3-a456-426614174003',
    }),
    __metadata("design:type", String)
], CreatePermissionResponseDto.prototype, "tenant_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Permiso para crear',
        example: true,
    }),
    __metadata("design:type", Boolean)
], CreatePermissionResponseDto.prototype, "can_create", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Permiso para leer',
        example: true,
    }),
    __metadata("design:type", Boolean)
], CreatePermissionResponseDto.prototype, "can_read", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Permiso para actualizar',
        example: true,
    }),
    __metadata("design:type", Boolean)
], CreatePermissionResponseDto.prototype, "can_update", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Permiso para eliminar',
        example: true,
    }),
    __metadata("design:type", Boolean)
], CreatePermissionResponseDto.prototype, "can_delete", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Permiso para listar',
        example: true,
    }),
    __metadata("design:type", Boolean)
], CreatePermissionResponseDto.prototype, "can_list", void 0);
//# sourceMappingURL=create-permission.dto.js.map
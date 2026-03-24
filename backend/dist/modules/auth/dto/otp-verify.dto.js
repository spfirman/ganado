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
exports.OtpLoginDto = exports.OtpVerifyDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class OtpVerifyDto {
}
exports.OtpVerifyDto = OtpVerifyDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '123456',
        description: 'Código TOTP de 6 dígitos o código de respaldo',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], OtpVerifyDto.prototype, "code", void 0);
class OtpLoginDto {
}
exports.OtpLoginDto = OtpLoginDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Token temporal recibido en el login',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], OtpLoginDto.prototype, "tempToken", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '123456',
        description: 'Código TOTP de 6 dígitos o código de respaldo',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], OtpLoginDto.prototype, "code", void 0);
//# sourceMappingURL=otp-verify.dto.js.map
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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_service_1 = require("./services/auth.service");
const password_recovery_service_1 = require("./services/password-recovery.service");
const otp_service_1 = require("./otp/otp.service");
const login_dto_1 = require("./dto/login.dto");
const refresh_token_dto_1 = require("./dto/refresh-token.dto");
const jwt_auth_guard_1 = require("./guards/jwt-auth.guard");
const session_user_decorator_1 = require("../../common/decorators/session-user.decorator");
const session_user_dto_1 = require("./dto/session-user.dto");
const logout_dto_1 = require("./dto/logout.dto");
const forgot_password_dto_1 = require("./dto/forgot-password.dto");
const reset_password_dto_1 = require("./dto/reset-password.dto");
const request_passcode_dto_1 = require("./dto/request-passcode.dto");
const verify_passcode_dto_1 = require("./dto/verify-passcode.dto");
const otp_verify_dto_1 = require("./dto/otp-verify.dto");
let AuthController = class AuthController {
    constructor(authService, passwordRecoveryService, otpService) {
        this.authService = authService;
        this.passwordRecoveryService = passwordRecoveryService;
        this.otpService = otpService;
    }
    async login(loginDto) {
        const user = await this.authService.validateUser(loginDto.username, loginDto.company_username, loginDto.password);
        return this.authService.login(user);
    }
    async loginWithOtp(dto) {
        return this.authService.loginWithOtp(dto.tempToken, dto.code);
    }
    async refresh(body) {
        const refreshToken = body.refresh_token ?? body.refreshToken;
        if (!refreshToken) {
            throw new common_1.UnauthorizedException('Refresh token is required');
        }
        return this.authService.refresh(refreshToken);
    }
    async logout(user, body) {
        return this.authService.logout(user.sub, user.sessionId, body.refresh_token);
    }
    async forgotPassword(dto) {
        return this.passwordRecoveryService.forgotPassword(dto.email);
    }
    async resetPassword(dto) {
        return this.passwordRecoveryService.resetPassword(dto.token, dto.password);
    }
    async requestPasscode(dto) {
        return this.passwordRecoveryService.requestPasscode(dto.email);
    }
    async verifyPasscode(dto) {
        const user = await this.passwordRecoveryService.verifyPasscode(dto.email, dto.code);
        return this.authService.login(user);
    }
    async otpSetup(user) {
        const userEmail = user.username;
        return this.otpService.setup(user.sub, userEmail);
    }
    async otpVerifySetup(user, dto) {
        return this.otpService.verifySetup(user.sub, dto.code);
    }
    async otpDisable(user, dto) {
        return this.otpService.disable(user.sub, dto.code);
    }
    async otpStatus(user) {
        return this.otpService.getStatus(user.sub);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('login'),
    (0, swagger_1.ApiOperation)({ summary: 'Iniciar sesión' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Token de acceso generado exitosamente o requiere OTP',
        schema: {
            properties: {
                access_token: {
                    type: 'string',
                    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                },
                requiresOtp: { type: 'boolean' },
                tempToken: { type: 'string' },
                user: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        username: { type: 'string' },
                        first_name: { type: 'string' },
                        last_name: { type: 'string' },
                        email: { type: 'string' },
                        tenant_id: { type: 'string' },
                        roles: { type: 'array', items: { type: 'object' } },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Credenciales inválidas' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('login/otp'),
    (0, swagger_1.ApiOperation)({ summary: 'Completar login con código OTP' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Login completado con OTP' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Código OTP inválido' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [otp_verify_dto_1.OtpLoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "loginWithOtp", null);
__decorate([
    (0, common_1.Post)('refresh'),
    (0, swagger_1.ApiOperation)({ summary: 'Renovar access token con refresh token' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Token renovado exitosamente' }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Refresh token inválido o expirado',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [refresh_token_dto_1.RefreshTokenDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
__decorate([
    (0, common_1.Post)('logout'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Cerrar sesión y revocar tokens en Redis' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Sesión cerrada' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'No autenticado' }),
    __param(0, (0, session_user_decorator_1.SessionUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_dto_1.SessionUserDto,
        logout_dto_1.LogoutDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Post)('forgot-password'),
    (0, swagger_1.ApiOperation)({ summary: 'Solicitar restablecimiento de contraseña por email' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Solicitud procesada' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [forgot_password_dto_1.ForgotPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.Post)('reset-password'),
    (0, swagger_1.ApiOperation)({ summary: 'Restablecer contraseña con token' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Contraseña restablecida' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Token inválido o expirado' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reset_password_dto_1.ResetPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.Post)('passcode/request'),
    (0, swagger_1.ApiOperation)({ summary: 'Solicitar código de acceso por email' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Solicitud procesada' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_passcode_dto_1.RequestPasscodeDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "requestPasscode", null);
__decorate([
    (0, common_1.Post)('passcode/verify'),
    (0, swagger_1.ApiOperation)({ summary: 'Verificar código de acceso e iniciar sesión' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Sesión iniciada' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Código inválido o expirado' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [verify_passcode_dto_1.VerifyPasscodeDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyPasscode", null);
__decorate([
    (0, common_1.Post)('otp/setup'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Configurar autenticación de dos factores (genera QR y códigos de respaldo)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'QR y códigos generados' }),
    __param(0, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_dto_1.SessionUserDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "otpSetup", null);
__decorate([
    (0, common_1.Post)('otp/verify-setup'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Verificar y activar 2FA con código TOTP' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '2FA activado' }),
    __param(0, (0, session_user_decorator_1.SessionUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_dto_1.SessionUserDto,
        otp_verify_dto_1.OtpVerifyDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "otpVerifySetup", null);
__decorate([
    (0, common_1.Post)('otp/disable'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Desactivar autenticación de dos factores' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '2FA desactivado' }),
    __param(0, (0, session_user_decorator_1.SessionUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_dto_1.SessionUserDto,
        otp_verify_dto_1.OtpVerifyDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "otpDisable", null);
__decorate([
    (0, common_1.Get)('otp/status'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener estado de 2FA del usuario' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Estado de 2FA' }),
    __param(0, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_dto_1.SessionUserDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "otpStatus", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('Autenticación'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        password_recovery_service_1.PasswordRecoveryService,
        otp_service_1.OtpService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map
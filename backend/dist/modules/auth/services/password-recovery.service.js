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
var PasswordRecoveryService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordRecoveryService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const password_reset_token_entity_1 = require("../entities/password-reset-token.entity");
const login_passcode_entity_1 = require("../entities/login-passcode.entity");
const user_entity_1 = require("../../employee-management/entities/user.entity");
const email_service_1 = require("./email.service");
const config_1 = require("@nestjs/config");
let PasswordRecoveryService = PasswordRecoveryService_1 = class PasswordRecoveryService {
    constructor(resetTokenRepo, passcodeRepo, userRepo, emailService, configService) {
        this.resetTokenRepo = resetTokenRepo;
        this.passcodeRepo = passcodeRepo;
        this.userRepo = userRepo;
        this.emailService = emailService;
        this.configService = configService;
        this.logger = new common_1.Logger(PasswordRecoveryService_1.name);
        this.appUrl =
            this.configService.get('APP_URL') || 'https://ganado.gpcb.com.co';
    }
    hashToken(token) {
        return crypto.createHash('sha256').update(token).digest('hex');
    }
    async forgotPassword(email) {
        const genericMessage = 'Si el correo está registrado, recibirás un enlace para restablecer tu contraseña.';
        const user = await this.userRepo.findOne({
            where: { email: email.toLowerCase().trim(), active: true },
        });
        if (!user) {
            return { message: genericMessage };
        }
        const windowStart = new Date(Date.now() -
            PasswordRecoveryService_1.RESET_WINDOW_MINUTES * 60 * 1000);
        const recentCount = await this.resetTokenRepo.count({
            where: {
                userId: user.id,
                createdAt: (0, typeorm_2.MoreThan)(windowStart),
            },
        });
        if (recentCount >= PasswordRecoveryService_1.MAX_RESET_REQUESTS) {
            this.logger.warn(`Rate limit exceeded for password reset: user ${user.id}`);
            return { message: genericMessage };
        }
        await this.resetTokenRepo.update({ userId: user.id, used: false }, { used: true });
        const rawToken = crypto.randomBytes(32).toString('hex');
        const tokenHash = this.hashToken(rawToken);
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
        await this.resetTokenRepo.save({
            userId: user.id,
            tokenHash,
            expiresAt,
            used: false,
        });
        const resetUrl = `${this.appUrl}/reset-password?token=${rawToken}`;
        await this.emailService.sendPasswordReset(user.email, rawToken, resetUrl);
        return { message: genericMessage };
    }
    async resetPassword(rawToken, newPassword) {
        const tokenHash = this.hashToken(rawToken);
        const resetToken = await this.resetTokenRepo.findOne({
            where: {
                tokenHash,
                used: false,
                expiresAt: (0, typeorm_2.MoreThan)(new Date()),
            },
        });
        if (!resetToken) {
            throw new common_1.BadRequestException('El enlace de restablecimiento es inválido o ha expirado.');
        }
        const user = await this.userRepo.findOne({
            where: { id: resetToken.userId, active: true },
        });
        if (!user) {
            throw new common_1.BadRequestException('El enlace de restablecimiento es inválido o ha expirado.');
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await this.userRepo.update(user.id, { password: hashedPassword });
        await this.resetTokenRepo.update(resetToken.id, { used: true });
        this.logger.log(`Password reset successful for user ${user.id}`);
        return { message: 'Tu contraseña ha sido restablecida exitosamente.' };
    }
    async requestPasscode(email) {
        const genericMessage = 'Si el correo está registrado, recibirás un código de acceso.';
        const user = await this.userRepo.findOne({
            where: { email: email.toLowerCase().trim(), active: true },
        });
        if (!user) {
            return { message: genericMessage };
        }
        const windowStart = new Date(Date.now() -
            PasswordRecoveryService_1.PASSCODE_WINDOW_MINUTES * 60 * 1000);
        const recentCount = await this.passcodeRepo.count({
            where: {
                userId: user.id,
                createdAt: (0, typeorm_2.MoreThan)(windowStart),
            },
        });
        if (recentCount >= PasswordRecoveryService_1.MAX_PASSCODE_REQUESTS) {
            this.logger.warn(`Rate limit exceeded for passcode request: user ${user.id}`);
            return { message: genericMessage };
        }
        await this.passcodeRepo.update({ userId: user.id, used: false }, { used: true });
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const codeHash = this.hashToken(code);
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
        await this.passcodeRepo.save({
            userId: user.id,
            codeHash,
            expiresAt,
            used: false,
            attempts: 0,
        });
        await this.emailService.sendPasscode(user.email, code);
        return { message: genericMessage };
    }
    async verifyPasscode(email, code) {
        const user = await this.userRepo.findOne({
            where: { email: email.toLowerCase().trim(), active: true },
            relations: ['roles'],
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Código inválido o expirado.');
        }
        const codeHash = this.hashToken(code);
        const passcode = await this.passcodeRepo.findOne({
            where: {
                userId: user.id,
                used: false,
                expiresAt: (0, typeorm_2.MoreThan)(new Date()),
            },
            order: { createdAt: 'DESC' },
        });
        if (!passcode) {
            throw new common_1.UnauthorizedException('Código inválido o expirado.');
        }
        if (passcode.attempts >=
            PasswordRecoveryService_1.MAX_PASSCODE_VERIFY_ATTEMPTS) {
            await this.passcodeRepo.update(passcode.id, { used: true });
            throw new common_1.UnauthorizedException('Demasiados intentos fallidos. Solicita un nuevo código.');
        }
        if (passcode.codeHash !== codeHash) {
            await this.passcodeRepo.update(passcode.id, {
                attempts: passcode.attempts + 1,
            });
            throw new common_1.UnauthorizedException('Código inválido o expirado.');
        }
        await this.passcodeRepo.update(passcode.id, { used: true });
        this.logger.log(`Passcode login successful for user ${user.id}`);
        return user;
    }
};
exports.PasswordRecoveryService = PasswordRecoveryService;
PasswordRecoveryService.RESET_WINDOW_MINUTES = 15;
PasswordRecoveryService.MAX_RESET_REQUESTS = 3;
PasswordRecoveryService.PASSCODE_WINDOW_MINUTES = 15;
PasswordRecoveryService.MAX_PASSCODE_REQUESTS = 5;
PasswordRecoveryService.MAX_PASSCODE_VERIFY_ATTEMPTS = 5;
exports.PasswordRecoveryService = PasswordRecoveryService = PasswordRecoveryService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(password_reset_token_entity_1.PasswordResetToken)),
    __param(1, (0, typeorm_1.InjectRepository)(login_passcode_entity_1.LoginPasscode)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        email_service_1.EmailService,
        config_1.ConfigService])
], PasswordRecoveryService);
//# sourceMappingURL=password-recovery.service.js.map
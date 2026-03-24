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
var OtpService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const otplib_1 = require("otplib");
const QRCode = require("qrcode");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const crypto_util_1 = require("./crypto.util");
let OtpService = OtpService_1 = class OtpService {
    constructor(dataSource) {
        this.dataSource = dataSource;
        this.logger = new common_1.Logger(OtpService_1.name);
        this.appName = process.env.EMAIL_APP_NAME || 'GPCB Ganado';
    }
    async setup(userId, userEmail) {
        const secret = otplib_1.authenticator.generateSecret();
        const backupCodes = Array.from({ length: 8 }, () => crypto.randomBytes(4).toString('hex'));
        const hashedBackups = backupCodes.map((c) => bcrypt.hashSync(c, 12));
        const encryptedSecret = (0, crypto_util_1.encrypt)(secret);
        await this.dataSource.query(`
      INSERT INTO user_otp (id, user_id, secret, is_enabled, backup_codes, created_at, updated_at)
      VALUES (gen_random_uuid(), $1, $2, false, $3::text[], NOW(), NOW())
      ON CONFLICT (user_id) DO UPDATE SET
        secret = $2,
        is_enabled = false,
        backup_codes = $3::text[],
        updated_at = NOW()
    `, [userId, encryptedSecret, hashedBackups]);
        const otpUri = otplib_1.authenticator.keyuri(userEmail, this.appName, secret);
        const qrCodeUrl = await QRCode.toDataURL(otpUri);
        return { qrCodeUrl, secret, backupCodes };
    }
    async verifySetup(userId, code) {
        const record = await this.getOtpRecord(userId);
        if (!record)
            throw new common_1.BadRequestException('OTP no configurado. Ejecuta el setup primero.');
        if (record.is_enabled)
            throw new common_1.BadRequestException('OTP ya está habilitado.');
        const secret = (0, crypto_util_1.decrypt)(record.secret);
        const isValid = otplib_1.authenticator.verify({ token: code, secret });
        if (!isValid)
            throw new common_1.UnauthorizedException('Código OTP inválido.');
        await this.dataSource.query(`
      UPDATE user_otp SET is_enabled = true, updated_at = NOW() WHERE user_id = $1
    `, [userId]);
        return { success: true, message: 'Autenticación de dos factores activada.' };
    }
    async verifyLogin(userId, code) {
        const record = await this.getOtpRecord(userId);
        if (!record || !record.is_enabled)
            return false;
        const secret = (0, crypto_util_1.decrypt)(record.secret);
        if (otplib_1.authenticator.verify({ token: code, secret })) {
            return true;
        }
        const backupCodes = record.backup_codes || [];
        const matchIndex = backupCodes.findIndex((hash) => bcrypt.compareSync(code, hash));
        if (matchIndex !== -1) {
            const updated = [...backupCodes];
            updated.splice(matchIndex, 1);
            await this.dataSource.query(`
        UPDATE user_otp SET backup_codes = $1::text[], updated_at = NOW() WHERE user_id = $2
      `, [updated, userId]);
            return true;
        }
        return false;
    }
    async disable(userId, code) {
        const isValid = await this.verifyLogin(userId, code);
        if (!isValid)
            throw new common_1.UnauthorizedException('Código OTP inválido.');
        await this.dataSource.query(`
      DELETE FROM user_otp WHERE user_id = $1
    `, [userId]);
        return { success: true, message: 'Autenticación de dos factores desactivada.' };
    }
    async isEnabled(userId) {
        const record = await this.getOtpRecord(userId);
        return record?.is_enabled === true;
    }
    async getStatus(userId) {
        const record = await this.getOtpRecord(userId);
        return {
            isEnabled: record?.is_enabled || false,
            backupCodesRemaining: record?.backup_codes?.length || 0,
        };
    }
    async getOtpRecord(userId) {
        const rows = await this.dataSource.query(`
      SELECT user_id, secret, is_enabled, backup_codes
      FROM user_otp WHERE user_id = $1
    `, [userId]);
        return rows?.[0] || null;
    }
};
exports.OtpService = OtpService;
exports.OtpService = OtpService = OtpService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], OtpService);
//# sourceMappingURL=otp.service.js.map
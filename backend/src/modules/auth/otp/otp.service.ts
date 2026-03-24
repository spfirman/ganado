import { Injectable, UnauthorizedException, BadRequestException, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { authenticator } from 'otplib';
import * as QRCode from 'qrcode';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { encrypt, decrypt } from './crypto.util';

@Injectable()
export class OtpService {
  private readonly logger = new Logger(OtpService.name);
  private appName = process.env.EMAIL_APP_NAME || 'GPCB Ganado';

  constructor(@InjectDataSource() private dataSource: DataSource) {}

  /**
   * Genera un nuevo secreto TOTP + código QR + códigos de respaldo.
   * NO activa OTP todavía — el usuario debe verificar primero.
   */
  async setup(userId: string, userEmail: string) {
    const secret = authenticator.generateSecret();
    const backupCodes = Array.from({ length: 8 }, () =>
      crypto.randomBytes(4).toString('hex'),
    );
    const hashedBackups = backupCodes.map((c) => bcrypt.hashSync(c, 12));
    const encryptedSecret = encrypt(secret);

    await this.dataSource.query(`
      INSERT INTO user_otp (id, user_id, secret, is_enabled, backup_codes, created_at, updated_at)
      VALUES (gen_random_uuid(), $1, $2, false, $3::text[], NOW(), NOW())
      ON CONFLICT (user_id) DO UPDATE SET
        secret = $2,
        is_enabled = false,
        backup_codes = $3::text[],
        updated_at = NOW()
    `, [userId, encryptedSecret, hashedBackups]);

    const otpUri = authenticator.keyuri(userEmail, this.appName, secret);
    const qrCodeUrl = await QRCode.toDataURL(otpUri);

    return { qrCodeUrl, secret, backupCodes };
  }

  /**
   * Verifica la configuración inicial — el usuario proporciona un código de su app autenticadora.
   * Si es válido, OTP se activa permanentemente.
   */
  async verifySetup(userId: string, code: string) {
    const record = await this.getOtpRecord(userId);
    if (!record) throw new BadRequestException('OTP no configurado. Ejecuta el setup primero.');
    if (record.is_enabled) throw new BadRequestException('OTP ya está habilitado.');

    const secret = decrypt(record.secret);
    const isValid = authenticator.verify({ token: code, secret });
    if (!isValid) throw new UnauthorizedException('Código OTP inválido.');

    await this.dataSource.query(`
      UPDATE user_otp SET is_enabled = true, updated_at = NOW() WHERE user_id = $1
    `, [userId]);

    return { success: true, message: 'Autenticación de dos factores activada.' };
  }

  /**
   * Verifica OTP durante el login. Retorna true si es válido (TOTP o código de respaldo).
   */
  async verifyLogin(userId: string, code: string): Promise<boolean> {
    const record = await this.getOtpRecord(userId);
    if (!record || !record.is_enabled) return false;

    const secret = decrypt(record.secret);

    // Intentar TOTP primero
    if (authenticator.verify({ token: code, secret })) {
      return true;
    }

    // Intentar códigos de respaldo
    const backupCodes: string[] = record.backup_codes || [];
    const matchIndex = backupCodes.findIndex((hash) =>
      bcrypt.compareSync(code, hash),
    );

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

  /**
   * Desactiva OTP — requiere un código válido.
   */
  async disable(userId: string, code: string) {
    const isValid = await this.verifyLogin(userId, code);
    if (!isValid) throw new UnauthorizedException('Código OTP inválido.');

    await this.dataSource.query(`
      DELETE FROM user_otp WHERE user_id = $1
    `, [userId]);

    return { success: true, message: 'Autenticación de dos factores desactivada.' };
  }

  /**
   * Verifica si el usuario tiene OTP habilitado.
   */
  async isEnabled(userId: string): Promise<boolean> {
    const record = await this.getOtpRecord(userId);
    return record?.is_enabled === true;
  }

  /**
   * Obtiene el estado de OTP del usuario.
   */
  async getStatus(userId: string) {
    const record = await this.getOtpRecord(userId);
    return {
      isEnabled: record?.is_enabled || false,
      backupCodesRemaining: record?.backup_codes?.length || 0,
    };
  }

  private async getOtpRecord(userId: string) {
    const rows = await this.dataSource.query(`
      SELECT user_id, secret, is_enabled, backup_codes
      FROM user_otp WHERE user_id = $1
    `, [userId]);
    return rows?.[0] || null;
  }
}

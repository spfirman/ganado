import {
  Injectable,
  Logger,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, MoreThan } from 'typeorm';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { PasswordResetToken } from '../entities/password-reset-token.entity';
import { LoginPasscode } from '../entities/login-passcode.entity';
import { User } from '../../employee-management/entities/user.entity';
import { EmailService } from './email.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PasswordRecoveryService {
  private readonly logger = new Logger(PasswordRecoveryService.name);
  private readonly appUrl: string;

  // Rate limit: max requests per user within window
  private static readonly RESET_WINDOW_MINUTES = 15;
  private static readonly MAX_RESET_REQUESTS = 3;
  private static readonly PASSCODE_WINDOW_MINUTES = 15;
  private static readonly MAX_PASSCODE_REQUESTS = 5;
  private static readonly MAX_PASSCODE_VERIFY_ATTEMPTS = 5;

  constructor(
    @InjectRepository(PasswordResetToken)
    private readonly resetTokenRepo: Repository<PasswordResetToken>,
    @InjectRepository(LoginPasscode)
    private readonly passcodeRepo: Repository<LoginPasscode>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
  ) {
    this.appUrl =
      this.configService.get<string>('APP_URL') || 'https://ganado.gpcb.com.co';
  }

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  // ── Forgot password ─────────────────────────────────────────────────

  async forgotPassword(email: string): Promise<{ message: string }> {
    const genericMessage =
      'Si el correo está registrado, recibirás un enlace para restablecer tu contraseña.';

    const user = await this.userRepo.findOne({
      where: { email: email.toLowerCase().trim(), active: true },
    });

    if (!user) {
      // Prevent email enumeration — always return success
      return { message: genericMessage };
    }

    // Rate limiting: count recent tokens for this user
    const windowStart = new Date(
      Date.now() -
        PasswordRecoveryService.RESET_WINDOW_MINUTES * 60 * 1000,
    );
    const recentCount = await this.resetTokenRepo.count({
      where: {
        userId: user.id,
        createdAt: MoreThan(windowStart),
      },
    });

    if (recentCount >= PasswordRecoveryService.MAX_RESET_REQUESTS) {
      // Still return generic message to prevent enumeration
      this.logger.warn(
        `Rate limit exceeded for password reset: user ${user.id}`,
      );
      return { message: genericMessage };
    }

    // Invalidate any existing unused tokens for this user
    await this.resetTokenRepo.update(
      { userId: user.id, used: false },
      { used: true },
    );

    // Generate token
    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = this.hashToken(rawToken);

    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

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

  // ── Reset password ──────────────────────────────────────────────────

  async resetPassword(
    rawToken: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    const tokenHash = this.hashToken(rawToken);

    const resetToken = await this.resetTokenRepo.findOne({
      where: {
        tokenHash,
        used: false,
        expiresAt: MoreThan(new Date()),
      },
    });

    if (!resetToken) {
      throw new BadRequestException(
        'El enlace de restablecimiento es inválido o ha expirado.',
      );
    }

    const user = await this.userRepo.findOne({
      where: { id: resetToken.userId, active: true },
    });

    if (!user) {
      throw new BadRequestException(
        'El enlace de restablecimiento es inválido o ha expirado.',
      );
    }

    // Hash new password and update user
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userRepo.update(user.id, { password: hashedPassword });

    // Mark token as used
    await this.resetTokenRepo.update(resetToken.id, { used: true });

    this.logger.log(`Password reset successful for user ${user.id}`);

    return { message: 'Tu contraseña ha sido restablecida exitosamente.' };
  }

  // ── Passcode request ────────────────────────────────────────────────

  async requestPasscode(email: string): Promise<{ message: string }> {
    const genericMessage =
      'Si el correo está registrado, recibirás un código de acceso.';

    const user = await this.userRepo.findOne({
      where: { email: email.toLowerCase().trim(), active: true },
    });

    if (!user) {
      return { message: genericMessage };
    }

    // Rate limiting
    const windowStart = new Date(
      Date.now() -
        PasswordRecoveryService.PASSCODE_WINDOW_MINUTES * 60 * 1000,
    );
    const recentCount = await this.passcodeRepo.count({
      where: {
        userId: user.id,
        createdAt: MoreThan(windowStart),
      },
    });

    if (recentCount >= PasswordRecoveryService.MAX_PASSCODE_REQUESTS) {
      this.logger.warn(
        `Rate limit exceeded for passcode request: user ${user.id}`,
      );
      return { message: genericMessage };
    }

    // Invalidate existing unused passcodes
    await this.passcodeRepo.update(
      { userId: user.id, used: false },
      { used: true },
    );

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const codeHash = this.hashToken(code);

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

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

  // ── Passcode verify ─────────────────────────────────────────────────

  async verifyPasscode(
    email: string,
    code: string,
  ): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { email: email.toLowerCase().trim(), active: true },
      relations: ['roles'],
    });

    if (!user) {
      throw new UnauthorizedException('Código inválido o expirado.');
    }

    const codeHash = this.hashToken(code);

    const passcode = await this.passcodeRepo.findOne({
      where: {
        userId: user.id,
        used: false,
        expiresAt: MoreThan(new Date()),
      },
      order: { createdAt: 'DESC' },
    });

    if (!passcode) {
      throw new UnauthorizedException('Código inválido o expirado.');
    }

    // Check attempts
    if (
      passcode.attempts >=
      PasswordRecoveryService.MAX_PASSCODE_VERIFY_ATTEMPTS
    ) {
      await this.passcodeRepo.update(passcode.id, { used: true });
      throw new UnauthorizedException(
        'Demasiados intentos fallidos. Solicita un nuevo código.',
      );
    }

    if (passcode.codeHash !== codeHash) {
      await this.passcodeRepo.update(passcode.id, {
        attempts: passcode.attempts + 1,
      });
      throw new UnauthorizedException('Código inválido o expirado.');
    }

    // Mark as used
    await this.passcodeRepo.update(passcode.id, { used: true });

    this.logger.log(`Passcode login successful for user ${user.id}`);

    return user;
  }
}

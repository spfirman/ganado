import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import * as crypto from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../employee-management/services/users.service';
import { ApplicationPermissionsService } from '../../../common/application-permissions/application-permissions.service';
import { RoleModulePermissionService } from '../../employee-management/services/role-module-permission.services';
import { OtpService } from '../otp/otp.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly applicationPermissionsService: ApplicationPermissionsService,
    private readonly roleModulePermissionsService: RoleModulePermissionService,
    private readonly otpService: OtpService,
  ) {}

  private parseDurationToSeconds(raw: string | undefined): number | null {
    if (!raw) return null;
    const value = raw.trim().toLowerCase();
    const match = /^(\d+)\s*([smhd])?$/.exec(value);
    if (!match) return null;
    const amount = Number.parseInt(match[1], 10);
    if (!Number.isFinite(amount) || amount <= 0) return null;
    const unit = match[2] ?? 's';
    const unitSeconds: Record<string, number> = {
      s: 1,
      m: 60,
      h: 3600,
      d: 86400,
    };
    return amount * unitSeconds[unit];
  }

  private getAccessTokenExpirationSeconds(): number {
    const configured = this.configService.get<string>('JWT_EXPIRATION');
    return this.parseDurationToSeconds(configured) ?? 86400;
  }

  private buildAccessPayload(sessionData: any) {
    return {
      username: sessionData.username,
      sub: sessionData.sub,
      tenant_id: sessionData.tenant_id,
      permissionsHash: sessionData.permissionsHash,
      sessionId: sessionData.sessionId,
    };
  }

  private async issueAccessAndRefreshTokens(sessionData: any) {
    const payload = this.buildAccessPayload(sessionData);
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = crypto.randomBytes(48).toString('hex');
    await this.applicationPermissionsService.saveRefreshToken(
      refreshToken,
      sessionData.sub,
      sessionData.sessionId,
    );
    return { accessToken, refreshToken };
  }

  async validateUser(
    username: string,
    company_username: string,
    password: string,
  ) {
    const user =
      await this.usersService.findByUsernameAndPasswordAndCompanyUsername(
        username,
        password,
        company_username,
      );
    this.logger.debug('User:', user);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    return user;
  }

  async login(user: any) {
    // Verificar si el usuario tiene 2FA habilitado
    const otpEnabled = await this.otpService.isEnabled(user.id);
    if (otpEnabled) {
      // Generar token temporal (corta duración) para completar el flujo OTP
      const tempPayload = {
        sub: user.id,
        purpose: 'otp-verify',
      };
      const tempToken = this.jwtService.sign(tempPayload, { expiresIn: '5m' });
      return {
        requiresOtp: true,
        tempToken,
        message: 'Se requiere código de autenticación de dos factores.',
      };
    }

    return this.issueFullLogin(user);
  }

  /**
   * Completa el login tras verificar OTP.
   */
  async loginWithOtp(tempToken: string, code: string) {
    let payload: any;
    try {
      payload = this.jwtService.verify(tempToken);
    } catch {
      throw new UnauthorizedException('Token temporal inválido o expirado.');
    }
    if (payload.purpose !== 'otp-verify') {
      throw new UnauthorizedException('Token temporal inválido.');
    }

    const isValid = await this.otpService.verifyLogin(payload.sub, code);
    if (!isValid) {
      throw new UnauthorizedException('Código OTP inválido.');
    }

    const user = await this.usersService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado.');
    }

    return this.issueFullLogin(user);
  }

  private async issueFullLogin(user: any) {
    const roleIds = user.roles.map((role) => role.id);
    const roleModulePermissions =
      await this.roleModulePermissionsService.getByRolesAndTenant(
        roleIds,
        user.tenantId,
      );
    const permissions =
      this.applicationPermissionsService.getSimplefiedModulePermissionsByRolesAndModuleAndTenant(
        roleModulePermissions,
      );
    this.logger.debug('Permissions:', permissions);

    const permissionsHash =
      this.applicationPermissionsService.computePermissionsHash(permissions);

    const sessionId = crypto.randomUUID();
    const sessionData = {
      username: user.username,
      sub: user.id,
      tenant_id: user.tenantId,
      date: new Date().toISOString(),
      permissionsHash: permissionsHash,
      permissions: permissions,
      sessionId: sessionId,
    };

    await this.applicationPermissionsService.saveSessionData(
      user.id,
      sessionId,
      sessionData,
    );

    const { accessToken, refreshToken } =
      await this.issueAccessAndRefreshTokens(sessionData);

    this.logger.debug('Access token generated for user:', user.id);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: this.getAccessTokenExpirationSeconds(),
      user: {
        id: user.id,
        username: user.username,
        first_name: user.firstName,
        last_name: user.lastName,
        email: user.email,
        tenant_id: user.tenantId,
        roles: user.roles,
      },
      permissions: permissions,
    };
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }

    const tokenData =
      await this.applicationPermissionsService.getRefreshTokenData(
        refreshToken,
      );
    if (!tokenData) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const sessionData =
      await this.applicationPermissionsService.getSessionFromRedis(
        tokenData.userId,
        tokenData.sessionId,
      );

    if (!sessionData) {
      await this.applicationPermissionsService.deleteRefreshToken(refreshToken);
      throw new UnauthorizedException('Session expired or invalid');
    }

    await this.applicationPermissionsService.deleteRefreshToken(refreshToken);

    const { accessToken, refreshToken: rotatedRefreshToken } =
      await this.issueAccessAndRefreshTokens(sessionData);

    return {
      access_token: accessToken,
      refresh_token: rotatedRefreshToken,
      expires_in: this.getAccessTokenExpirationSeconds(),
      permissions: sessionData.permissions,
      user: {
        id: sessionData.sub,
        username: sessionData.username,
        tenant_id: sessionData.tenant_id,
      },
    };
  }

  async logout(
    userId: string,
    sessionId: string,
    refreshToken?: string,
  ) {
    await this.applicationPermissionsService.deleteUserSession(
      userId,
      sessionId,
    );
    await this.applicationPermissionsService.deleteRefreshTokenBySession(
      userId,
      sessionId,
    );
    if (refreshToken) {
      await this.applicationPermissionsService.deleteRefreshToken(refreshToken);
    }
    return { message: 'Session closed' };
  }
}

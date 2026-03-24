import { Controller, Post, Get, Body, UseGuards, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './services/auth.service';
import { PasswordRecoveryService } from './services/password-recovery.service';
import { OtpService } from './otp/otp.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { SessionUser } from '../../common/decorators/session-user.decorator';
import { SessionUserDto } from './dto/session-user.dto';
import { LogoutDto } from './dto/logout.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { RequestPasscodeDto } from './dto/request-passcode.dto';
import { VerifyPasscodeDto } from './dto/verify-passcode.dto';
import { OtpVerifyDto, OtpLoginDto } from './dto/otp-verify.dto';

@ApiTags('Autenticación')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly passwordRecoveryService: PasswordRecoveryService,
    private readonly otpService: OtpService,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiResponse({
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
  })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(
      loginDto.username,
      loginDto.company_username,
      loginDto.password,
    );
    return this.authService.login(user);
  }

  @Post('login/otp')
  @ApiOperation({ summary: 'Completar login con código OTP' })
  @ApiResponse({ status: 200, description: 'Login completado con OTP' })
  @ApiResponse({ status: 401, description: 'Código OTP inválido' })
  async loginWithOtp(@Body() dto: OtpLoginDto) {
    return this.authService.loginWithOtp(dto.tempToken, dto.code);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Renovar access token con refresh token' })
  @ApiResponse({ status: 200, description: 'Token renovado exitosamente' })
  @ApiResponse({
    status: 401,
    description: 'Refresh token inválido o expirado',
  })
  async refresh(@Body() body: RefreshTokenDto) {
    const refreshToken = body.refresh_token ?? body.refreshToken;
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }
    return this.authService.refresh(refreshToken);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Cerrar sesión y revocar tokens en Redis' })
  @ApiResponse({ status: 200, description: 'Sesión cerrada' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  async logout(
    @SessionUser() user: SessionUserDto,
    @Body() body: LogoutDto,
  ) {
    return this.authService.logout(user.sub, user.sessionId, body.refresh_token);
  }

  // ── Password Recovery ─────────────────────────────────────────────

  @Post('forgot-password')
  @ApiOperation({ summary: 'Solicitar restablecimiento de contraseña por email' })
  @ApiResponse({ status: 200, description: 'Solicitud procesada' })
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.passwordRecoveryService.forgotPassword(dto.email);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Restablecer contraseña con token' })
  @ApiResponse({ status: 200, description: 'Contraseña restablecida' })
  @ApiResponse({ status: 400, description: 'Token inválido o expirado' })
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.passwordRecoveryService.resetPassword(dto.token, dto.password);
  }

  // ── Passcode Login ────────────────────────────────────────────────

  @Post('passcode/request')
  @ApiOperation({ summary: 'Solicitar código de acceso por email' })
  @ApiResponse({ status: 200, description: 'Solicitud procesada' })
  async requestPasscode(@Body() dto: RequestPasscodeDto) {
    return this.passwordRecoveryService.requestPasscode(dto.email);
  }

  @Post('passcode/verify')
  @ApiOperation({ summary: 'Verificar código de acceso e iniciar sesión' })
  @ApiResponse({ status: 200, description: 'Sesión iniciada' })
  @ApiResponse({ status: 401, description: 'Código inválido o expirado' })
  async verifyPasscode(@Body() dto: VerifyPasscodeDto) {
    const user = await this.passwordRecoveryService.verifyPasscode(
      dto.email,
      dto.code,
    );
    return this.authService.login(user);
  }

  // ── OTP / 2FA ─────────────────────────────────────────────────────

  @Post('otp/setup')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Configurar autenticación de dos factores (genera QR y códigos de respaldo)' })
  @ApiResponse({ status: 200, description: 'QR y códigos generados' })
  async otpSetup(@SessionUser() user: SessionUserDto) {
    const userEmail = user.username; // fallback; ideally would use email
    return this.otpService.setup(user.sub, userEmail);
  }

  @Post('otp/verify-setup')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Verificar y activar 2FA con código TOTP' })
  @ApiResponse({ status: 200, description: '2FA activado' })
  async otpVerifySetup(
    @SessionUser() user: SessionUserDto,
    @Body() dto: OtpVerifyDto,
  ) {
    return this.otpService.verifySetup(user.sub, dto.code);
  }

  @Post('otp/disable')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Desactivar autenticación de dos factores' })
  @ApiResponse({ status: 200, description: '2FA desactivado' })
  async otpDisable(
    @SessionUser() user: SessionUserDto,
    @Body() dto: OtpVerifyDto,
  ) {
    return this.otpService.disable(user.sub, dto.code);
  }

  @Get('otp/status')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Obtener estado de 2FA del usuario' })
  @ApiResponse({ status: 200, description: 'Estado de 2FA' })
  async otpStatus(@SessionUser() user: SessionUserDto) {
    return this.otpService.getStatus(user.sub);
  }
}

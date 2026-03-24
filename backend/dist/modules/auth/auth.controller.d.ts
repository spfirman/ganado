import { AuthService } from './services/auth.service';
import { PasswordRecoveryService } from './services/password-recovery.service';
import { OtpService } from './otp/otp.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { SessionUserDto } from './dto/session-user.dto';
import { LogoutDto } from './dto/logout.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { RequestPasscodeDto } from './dto/request-passcode.dto';
import { VerifyPasscodeDto } from './dto/verify-passcode.dto';
import { OtpVerifyDto, OtpLoginDto } from './dto/otp-verify.dto';
export declare class AuthController {
    private readonly authService;
    private readonly passwordRecoveryService;
    private readonly otpService;
    constructor(authService: AuthService, passwordRecoveryService: PasswordRecoveryService, otpService: OtpService);
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        refresh_token: string;
        expires_in: number;
        user: {
            id: any;
            username: any;
            first_name: any;
            last_name: any;
            email: any;
            tenant_id: any;
            roles: any;
        };
        permissions: Record<string, Record<string, string>>;
    } | {
        requiresOtp: boolean;
        tempToken: string;
        message: string;
    }>;
    loginWithOtp(dto: OtpLoginDto): Promise<{
        access_token: string;
        refresh_token: string;
        expires_in: number;
        user: {
            id: any;
            username: any;
            first_name: any;
            last_name: any;
            email: any;
            tenant_id: any;
            roles: any;
        };
        permissions: Record<string, Record<string, string>>;
    }>;
    refresh(body: RefreshTokenDto): Promise<{
        access_token: string;
        refresh_token: string;
        expires_in: number;
        permissions: any;
        user: {
            id: any;
            username: any;
            tenant_id: any;
        };
    }>;
    logout(user: SessionUserDto, body: LogoutDto): Promise<{
        message: string;
    }>;
    forgotPassword(dto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(dto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    requestPasscode(dto: RequestPasscodeDto): Promise<{
        message: string;
    }>;
    verifyPasscode(dto: VerifyPasscodeDto): Promise<{
        access_token: string;
        refresh_token: string;
        expires_in: number;
        user: {
            id: any;
            username: any;
            first_name: any;
            last_name: any;
            email: any;
            tenant_id: any;
            roles: any;
        };
        permissions: Record<string, Record<string, string>>;
    } | {
        requiresOtp: boolean;
        tempToken: string;
        message: string;
    }>;
    otpSetup(user: SessionUserDto): Promise<{
        qrCodeUrl: string;
        secret: string;
        backupCodes: string[];
    }>;
    otpVerifySetup(user: SessionUserDto, dto: OtpVerifyDto): Promise<{
        success: boolean;
        message: string;
    }>;
    otpDisable(user: SessionUserDto, dto: OtpVerifyDto): Promise<{
        success: boolean;
        message: string;
    }>;
    otpStatus(user: SessionUserDto): Promise<{
        isEnabled: any;
        backupCodesRemaining: any;
    }>;
}

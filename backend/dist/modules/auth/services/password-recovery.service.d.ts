import { Repository } from 'typeorm';
import { PasswordResetToken } from '../entities/password-reset-token.entity';
import { LoginPasscode } from '../entities/login-passcode.entity';
import { User } from '../../employee-management/entities/user.entity';
import { EmailService } from './email.service';
import { ConfigService } from '@nestjs/config';
export declare class PasswordRecoveryService {
    private readonly resetTokenRepo;
    private readonly passcodeRepo;
    private readonly userRepo;
    private readonly emailService;
    private readonly configService;
    private readonly logger;
    private readonly appUrl;
    private static readonly RESET_WINDOW_MINUTES;
    private static readonly MAX_RESET_REQUESTS;
    private static readonly PASSCODE_WINDOW_MINUTES;
    private static readonly MAX_PASSCODE_REQUESTS;
    private static readonly MAX_PASSCODE_VERIFY_ATTEMPTS;
    constructor(resetTokenRepo: Repository<PasswordResetToken>, passcodeRepo: Repository<LoginPasscode>, userRepo: Repository<User>, emailService: EmailService, configService: ConfigService);
    private hashToken;
    forgotPassword(email: string): Promise<{
        message: string;
    }>;
    resetPassword(rawToken: string, newPassword: string): Promise<{
        message: string;
    }>;
    requestPasscode(email: string): Promise<{
        message: string;
    }>;
    verifyPasscode(email: string, code: string): Promise<User>;
}

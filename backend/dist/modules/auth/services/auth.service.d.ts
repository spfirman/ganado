import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../employee-management/services/users.service';
import { ApplicationPermissionsService } from '../../../common/application-permissions/application-permissions.service';
import { RoleModulePermissionService } from '../../employee-management/services/role-module-permission.services';
import { OtpService } from '../otp/otp.service';
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    private readonly configService;
    private readonly applicationPermissionsService;
    private readonly roleModulePermissionsService;
    private readonly otpService;
    private readonly logger;
    constructor(usersService: UsersService, jwtService: JwtService, configService: ConfigService, applicationPermissionsService: ApplicationPermissionsService, roleModulePermissionsService: RoleModulePermissionService, otpService: OtpService);
    private parseDurationToSeconds;
    private getAccessTokenExpirationSeconds;
    private buildAccessPayload;
    private issueAccessAndRefreshTokens;
    validateUser(username: string, company_username: string, password: string): Promise<import("../../employee-management/entities/user.entity").User>;
    login(user: any): Promise<{
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
    loginWithOtp(tempToken: string, code: string): Promise<{
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
    private issueFullLogin;
    refresh(refreshToken: string): Promise<{
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
    logout(userId: string, sessionId: string, refreshToken?: string): Promise<{
        message: string;
    }>;
}

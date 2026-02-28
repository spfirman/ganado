import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../employee-management/services/users.service';
import { User } from '../../employee-management/entities/user.entity';
import { ApplicationPermissionsService } from '../../../common/application-permissions/application-permissions.service';
import { RoleModulePermissionService } from '../../employee-management/services/role-module-permission.services';
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    private readonly configService;
    private readonly applicationPermissionsService;
    private readonly roleModulePermissionsService;
    private readonly logger;
    constructor(usersService: UsersService, jwtService: JwtService, configService: ConfigService, applicationPermissionsService: ApplicationPermissionsService, roleModulePermissionsService: RoleModulePermissionService);
    private parseDurationToSeconds;
    private getAccessTokenExpirationSeconds;
    private buildAccessPayload;
    private issueAccessAndRefreshTokens;
    validateUser(username: string, company_username: string, password: string): Promise<any>;
    login(user: User): Promise<{
        access_token: string;
        refresh_token: string;
        expires_in: number;
        user: {
            id: string;
            username: string;
            first_name: string;
            last_name: string;
            email: string;
            tenant_id: string;
            roles: import("../../employee-management/entities/role.entity").Role[];
        };
        permissions: Record<string, Record<string, string>>;
    }>;
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

import { AuthService } from './services/auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { SessionUserDto } from './dto/session-user.dto';
import { LogoutDto } from './dto/logout.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
}

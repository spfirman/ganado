import { User } from '../../employee-management/entities/user.entity';
export declare class LoginPasscode {
    id: string;
    userId: string;
    user: User;
    codeHash: string;
    expiresAt: Date;
    used: boolean;
    attempts: number;
    createdAt: Date;
}
